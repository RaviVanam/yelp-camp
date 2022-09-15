const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middlewares')
const { Router } = require('express')
const router = new Router({ mergeParams: true })
const reviews = require('../controllers/reviews')

router.route('/')
    .post(isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router