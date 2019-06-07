const PostModel = require('../models/post');
const Post = new PostModel();
const CommentModel = require('../models/comment');
const Comment = new CommentModel();

module.exports = {
  // 创建文章
  createPost: function(post) {
    return Post.create(post);
  },

  // 通过文章id获取文章
  getPostById: function(postId) {
    return Post.findOne({_id: postId});
  },

  // 获取所有文章或者获取指定作者的所有文章
  getPosts: function(author) {
    const query = {};
    if (author) {
      query.author = author;
    }
    return Post.findAll(query);
  },

  // 通过文章id给pv加1
  incPv: function(postId) {
    return Post.update({_id: postId}, {$inc: {pv: 1}});
  },

  // 通过文章id更新一篇文章
  updatePostById: function(postId, data) {
    return Post.update({_id: postId}, { $set: data });
  },

  // 通过文章id删除一篇文章
  delPostById: function(postId) {
    return Post.deleteOne({ _id: postId }).then(res => {
      if (res.result.ok && res.result.n > 0) {
        return Comment.deleteMany({postId: postId});
      }
    });
  }
}
