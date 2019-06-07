const marked = require('marked');
const mongoose = require('mongoose');
const {mongoClient} = require('../lib/mongo');
const plugin = require('../lib/plugin');
const BaseModel = require('./baseModel');

const CommentModel = require('./comment');
const Comment = new CommentModel();

/**
  * 操作 MongoDb 时需要创建两个文件 model.js 和 modelDao.js
  *
  * 一. 对于 Model.js 以下几部分：
  * 1. Schema 必要
  * 2. plugin 可选
  * 3. hook 可选
  * 4. 调用 mongoClient.model() 创建 Model，此处注意，Model 名称与 js 文件名一样，但首字母大写
  *
  * 二. 对于 modelDao.js
  * 我们需要声明一个 ModelDao 的 class 继承自 BaseDao， BaseDao 中包含基本的 crud 操作，也可以根据需求自行定义
  *
  * 三. 外部使用
  * var dao = new ModelDao()
  * dao.crud();
  */


const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  pv: { type: 'number', default: 0 },
})


 /**
  * 配置 plugin
  */
postSchema.plugin(plugin.createdAt);
postSchema.plugin(plugin.updatedAt);

// 配置hooks
postSchema.post('find', function(results, next) {
  Promise.all(results.map(post => {
    return Comment.count({postId: post._id})
      .then(count => {
        post.commentsCount = count;
        post.content = marked(post.content);
        return post;
      })
  }))
  next();
})

postSchema.post('findOne', function(result, next) {
  if (result) {
    Comment.count({postId: result._id}).then(count => {
      result.commentsCount = count;
      result.content = marked(result.content);
      return result;
    })
  }
  next();
})

/**
  * 配置 hook
  */
 // (function () {
 //     bookSchema.pre('update', function (next) {
 //         console.log('pre update');
 //         next();
 //     });
 //
 //     bookSchema.post('update', function (result, next) {
 //         console.log('post update', result);
 //         next();
 //     });
 //
 //     bookSchema.pre('save', function (next) {
 //         console.log('--------pre1------');
 //         next();
 //     });
 //
 //     bookSchema.pre('save', function (next) {
 //         console.log('--------pre2------');
 //         next(); // 如果有下一个 pre(), 则执行下一个 pre(), 否则 执行 save()
 //     });
 //     bookSchema.post('save', function (result, next) {
 //         console.log('---------post1----------', result);
 //         next();
 //     });
 //
 //     bookSchema.post('save', function (result, next) {
 //         console.log('---------post2----------', result);
 //         next(); // 如果有下一个 post(), 则执行下一个 post(), 否则 结束
 //     });
 // })();

 /**
  * 参数一要求与 Model 名称一致
  * 参数二为 Schema
  * 参数三为映射到 MongoDB 的 Collection 名
  */
const Post = mongoClient.model('Post', postSchema, 'post');

class PostModel extends BaseModel {
  constructor() {
    super(Post);
  }
  
  /**
   * 查找符合条件的第一条，关联查询user doc
   *
   * @param condition
   * @param constraints
   * @returns {Promise}
   */
  findOne(condition, constraints) {
    return new Promise((resolve, reject) => {
      this.Model.findOne(condition, constraints ? constraints : null)
        .populate({ path: 'author', model: 'User' })
        .exec((error, result) => {
        if (error) {
          console.log('findOne error --> ', error);
          reject(error);
        } else {
          console.log('findOne result --> ', result);
          resolve(result);
        }
      });
    });
  }

  /**
   * 查询所有符合条件，关联查询user docs
   *
   * @param condition 查找条件
   * @param constraints
   * @returns {Promise}
   */
  findAll(condition, constraints) {
    return new Promise((resolve, reject) => {
      this.Model.find(condition, constraints ? constraints : null)
        .populate({ path: 'author', model: 'User' })
        .sort({ _id: -1 })
        .exec((error, results) => {
        if (error) {
          console.log('findAll error --> ', error);
          reject(error);
        } else {
          console.log('findAll results --> ', results);
          resolve(results);
        }
      });
    });
  }
}

// function test() {
//     let bookDao = new BookDao();
    // let bookEntity = new Book({title: '三国', author: '罗贯中'});
    // let bookEntity1 = new Book({title: '蓄势待发1', author: '麻花'});
    // let bookEntity2 = new Book({title: '蓄势待发2', author: '麻花'});
    // bookDao.create({title: '三国', author: '罗贯中'}).then((result) => console.log('create dao-->', result));
    // bookDao.save({title: '三国', author: '罗贯中中'}).then((result) => console.log('save dao --> ', result));
    // bookDao.update({title: '蓄势待发'}, {$set: {author: '开心'}}).then((result) => console.log('update dao--> ', result));
    // bookDao.findOne({title: '蓄势待发'}).then((results) => console.log('findOne dao --> ', results));
    // bookDao.findAll({title: '基督山伯爵'}).then((results) => console.log('findOne dao --> ', results));
    // bookDao.remove({title: '蓄势待发'}).then((results) => console.log('remove dal --> ', results));
// }

module.exports = PostModel;
