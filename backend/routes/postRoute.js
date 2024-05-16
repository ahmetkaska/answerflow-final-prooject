const express = require('express');
const router = express.Router();
const { createPost, showPost, showUserPosts, showSinglePost, deletePost, updatePost, addComment, addLike, removeLike , deleteComment, updateComment} = require('../controllers/postController');
const { isAuthenticated, isAdmin, isUser } = require('../middleware/auth');

// routes
//router.post('/post/create', isAuthenticated, isUser, createPost);
//router.post('/post/create', isAuthenticated, isAdmin, createPost);
router.post('/post/create', isAuthenticated, createPost);

router.get('/posts/show',  showPost);
router.get('/posts/showuser', showUserPosts);
//router.get('/posts/showuser',  showUserPosts);
router.get('/post/:id', showSinglePost);

router.delete('/delete/post/:id', isAuthenticated, deletePost);
//router.delete('/delete/post/:id', isAuthenticated,  deletePost);

//router.put('/update/post/:id', isAuthenticated, isAdmin, updatePost);
//router.put('/update/post/:id', isAuthenticated, isUser, updatePost);

router.put('/update/post/:id', isAuthenticated, updatePost);
router.put('/comment/post/:id', isAuthenticated, addComment);
router.put('/addlike/post/:id', isAuthenticated, addLike);
router.put('/removelike/post/:id',removeLike);

router.delete('/delete/comments/:id', deleteComment);

router.put('/edit/comment/:id', updateComment);

module.exports = router;