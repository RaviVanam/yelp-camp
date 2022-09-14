const Campground = require('./models/campgrounds')
const Review = require('./models/reviews')
const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You have to be signed in!')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const message = error.details.map(detail => detail.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', `You don't have permission for that!`)
        return res.redirect(`/campgrounds/${id}`)
    }
    return next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const message = error.details.map(detail => detail.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', `You don't have rights over that review!`)
        return res.redirect(`/campgrounds/${id}`)
    }
    return next()
}