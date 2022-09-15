const router = require('express').Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users')

router.route('/register')
    .get(users.showRegistrationPage)
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(catchAsync(users.showLoginPage))
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.loginUser)

router.route('/logout')
    .get(users.logoutUser)

module.exports = router