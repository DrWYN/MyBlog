const mongoose = require('mongoose');
const {mongoClient} = require('../lib/mongo');
const plugin = require('../lib/plugin');
const BaseModel = require('./baseModel');

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


const userSchema = new mongoose.Schema({
  name: { type: 'string', unique:true, required: true },
  password: { type: 'string', required: true }, 
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true }
})


 /**
  * 配置 plugin
  */
userSchema.plugin(plugin.createdAt);
userSchema.plugin(plugin.updatedAt);

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
const User = mongoClient.model('User', userSchema, 'user');

class UserModel extends BaseModel {
  constructor() {
    super(User);
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

module.exports = UserModel;
