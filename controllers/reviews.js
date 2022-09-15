const Campground = require('../models/campgrounds.js')
const Review = require('../models/reviews.js')


module.exports.createReview = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review({ ...req.body.review, author: req.user._id })
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'successfully posted a review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}