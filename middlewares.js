module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Permission Denied: You have to be signed in!')
        return res.redirect('/login')
    }
    next()
}