const CommentModel = require('../models/comment');
const Comment = new CommentModel();

module.exports = {
  // 创建一个留言
  createComment: function(comment) {
    return Comment.create(comment);
  },

  // 通过留言id获取留言
  getCommentById: function(commentId) {
    return Comment.findOne({_id: commentId});
  },

  // 通过留言id删除一个留言
  delCommentById: function(commentId) {
    return Comment.deleteOne({_id: commentId});
  },

  // 通过文章id删除该文章下的所有留言
  delCommentsByPostId: function(postId) {
    return Comment.deleteMany({postId: postId});
  },

  // 通过文章id获取该文章下的所有留言,按照留言创建时间排序
  getComments: function(postId) {
    return Comment.findAll({postId: postId}); 
  },

  // 通过文章id获取该文章下的留言数
  getCommentsCount: function(postId) {
    return Comment.count({postId: postId});
  }
}
