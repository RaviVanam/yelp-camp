const Review = require('../models/reviews.js')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campgrounds.js')
const { isLoggedIn } = require('../middlewares')
const { Router } = require('express')
const router = new Router({ mergeParams: true })
const { validateReview } = require('../middlewares')
const User = require('../models/user.js')
const { isReviewAuthor } = require('../middlewares')

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review({ ...req.body.review, author: req.user._id })
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'successfully posted a review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router