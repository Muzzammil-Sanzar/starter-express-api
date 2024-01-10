var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

/* GET users listing. */
router.post('/register', userController.user);

// Email Verification
router.post('/email', userController.emailVerification);
router.post('/login', userController.login);
router.post('/update-password', userController.updatePassword);
router.get('/get-user', auth, userController.getUser);
router.get('/test', userController.testUser);
router.post('/update', auth, userController.updateUser);

module.exports = router;
