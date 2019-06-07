const marked = require('marked');
const mongoose = require('mongoose');
const { mongoClient } = require('../lib/mongo');
const plugin = require('../lib/plugin');
const BaseModel = require('./baseModel');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: 'string', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true }
})

commentSchema.plugin(plugin.createdAt);
commentSchema.plugin(plugin.updatedAt);

// 配置hooks
commentSchema.post('find', function(results, next) {
  results.map(comment => {
    comment.content = marked(comment.content);
    return comment;
  });
  next();
})

const Comment = mongoClient.model('Comment', commentSchema, 'comment');

class CommentModel extends BaseModel {
  constructor() {
    super(Comment);
  }

  
  /**
   * 查询所有符合条件 docs
   *
   * @param condition 查找条件
   * @param constraints
   * @returns {Promise}
   */
  findAll(condition, constraints) {
    return new Promise((resolve, reject) => {
      this.Model.find(condition, constraints ? constraints : null)
        .populate({ path: 'author', model: 'User' })
        .sort({ _id: 1 })
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

module.exports = CommentModel;
