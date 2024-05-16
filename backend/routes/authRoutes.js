const express = require('express');
const router = express.Router();
const { updateUser } = require('../controllers/authController');
const { signup, signin, logout, userProfile, showUsers, deleteUser, createUser, updateUser2} = require('../controllers/authController');

const { isAuthenticated } = require('../middleware/auth');


//auth routes
// /api/signup
router.post('/signup', signup);


// /api/signin
router.post('/signin', signin);
// /api/logout
router.get('/logout', logout);
// /api/me
router.get('/me', isAuthenticated, userProfile);

router.put('/user/update', isAuthenticated, updateUser);

router.get('/users/show',  showUsers);

router.delete('/users/delete/:id', isAuthenticated, deleteUser);

router.post('/user/create', createUser);

router.put('/admin/updateUser/:id', updateUser2);


module.exports = router;