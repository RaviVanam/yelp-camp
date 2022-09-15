const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground, isAuthor } = require('../middlewares')
const { Router } = require('express')
const router = new Router()
const campgrounds = require('../controllers/campgrounds')

router.route('/')
    .get(catchAsync(campgrounds.showAllCampgrounds))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.route('/new')
    .get(isLoggedIn, campgrounds.showCreateCampground)

router.route('/:id')
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.showEditCampgroud))

module.exports = router