const Review = require('../models/reviews.js')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campgrounds.js')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas')
const { Router } = require('express')
const router = new Router({ mergeParams: true })

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const message = error.details.map(detail => detail.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'successfully posted a review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router