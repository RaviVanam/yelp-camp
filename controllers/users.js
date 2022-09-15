const User = require('../models/user')

module.exports.showRegistrationPage = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res) => {
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
}

module.exports.showLoginPage = async (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    const redirectTo = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    req.flash('success', 'welcome back!')
    res.redirect(redirectTo)
}

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) return next(err)
        req.flash('success', 'Successfully logged out!')
        res.redirect('/login')
    })
}