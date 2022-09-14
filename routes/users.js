const router = require('express').Router()
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const newUser = await User.register(user, password)
        req.login(newUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', catchAsync(async (req, res) => {
    res.render('users/login')
}))

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    const redirectTo = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    req.flash('success', 'welcome back!')
    res.redirect(redirectTo)
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err)
        req.flash('success', 'Successfully logged out!')
        res.redirect('/login')
    })
})

module.exports = router