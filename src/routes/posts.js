const express = require('express');
const router = express.Router();

const PostService = require('../service/post');
const CommentService = require('../service/comment');
const checkLogin = require('../middlewares/check').checkLogin;

// GET /posts 所有用户或者特定用户的文章页
// eg: GET /posts?author=xxx
router.get('/', function(req, res, next) {
  const author = req.query.author;

  PostService.getPosts(author).then((posts) => {
    res.render('posts', {
      posts: posts
    });
  }).catch (next);
})

// POST /posts/create 发表文章
router.post('/create', checkLogin, function(req, res, next) {
  const author = req.session.user._id;
  const title = req.fields.title;
  const content = req.fields.content;

  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }
    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  let post = {
    author: author,
    title: title,
    content: content
  }
  PostService.createPost(post).then(function(result) {
    // 此post是插入mongodb后的值,包含_id
    const {_id} = result;
    req.flash('success', '发表成功');
    res.redirect(`/posts/${_id}`);
  }).catch (next);
})

// GET /posts/create 发表文章页面
router.get('/create', checkLogin, function(req, res, next) {
  res.render('create');
})

// GET /posts/:postId 单独一篇文章页
router.get('/:postId', function(req, res, next) {
  const postId = req.params.postId;

  Promise.all([
    PostService.getPostById(postId),
    CommentService.getComments(postId),
    PostService.incPv(postId)
  ]).then(result => {
    const post = result[0];
    const comments = result[1]
    if (!post) {
      throw new Error('该文章不存在');
    }
    res.render('post', {
      post: post,
      comments: comments
    });
  }).catch (next);
})

// GET /posts/:postId/edit 更新文章
router.get('/:postId/edit', checkLogin, function(req, res, next) {
  const postId = req.params.postId;
  const author = req.session.user._id;

  PostService.getPostById(postId).then(post => {
    if (!post) {
      throw new Error('该文章不存在');
    }
    if (author.toString() !== post.author._id.toString()) {
      throw new Error('权限不足');
    }
    res.render('edit', {
      post: post
    })
  }).catch(next);
})

// POST /posts/:postId/edit
router.post('/:postId/edit', checkLogin, function(req, res, next) {
  const postId = req.params.postId;
  const author = req.session.user._id;
  const title = req.fields.title;
  const content = req.fields.content;

  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }
    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  PostService.getPostById(postId).then(post => {
    if (!post) {
      throw new Error('文章不存在');
    }
    if (post.author._id.toString() !== author.toString()) {
      throw new Error('没有权限');
    }
    PostService.updatePostById(postId, {title: title, content: content}).then(() => {
      req.flash('success', '编辑成功');
      res.redirect(`/posts/${postId}`);
    }).catch (next);
  })
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  const postId = req.params.postId;
  const author = req.session.user._id;

  PostService.getPostById(postId).then(post => {
    if (!post) {
      throw new Error('文章不存在');
    }
    if (post.author._id.toString() !== author.toString()) {
      throw new Error('没有权限');
    }
    PostService.delPostById(postId).then(() => {
      req.flash('success', '删除成功');
      res.redirect('/posts');
    }).catch (next);
  })
})

module.exports = router
