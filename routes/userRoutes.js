const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const user = require('../controllers/user')

router.get('/',user.homePage)
router.get('/register', user.registerForm)
 router.post('/register',catchAsync(user.createAccount))

router.get('/login',user.loginForm)


router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true ,failureredirect:true}),user.login)

router.get('/logout',user.logout);






module.exports= router;
