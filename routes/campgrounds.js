const Campground = require('../models/campgrounds.js')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground, isAuthor } = require('../middlewares')
const { Router } = require('express')
const router = new Router()


router.get('/', catchAsync(
    async (req, res, next) => {
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', { campgrounds })
    }
))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(
    async (req, res, next) => {
        // if (!req.body.campground) throw new ExpressError('Invalid data', 400)
        const newCampground = new Campground({ ...req.body.campground, author: req.user._id })
        await newCampground.save()
        req.flash('success', 'successfully created campground')
        res.redirect(`/campgrounds/${newCampground._id}`)
    }
))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(
    async (req, res) => {
        const { id } = req.params
        await Campground.findByIdAndUpdate(id, req.body.campground)
        req.flash('success', 'successfully updated campground')
        res.redirect(`/campgrounds/${id}`)
    }
))

router.get('/:id', catchAsync(
    async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id).populate('reviews').populate('author')
        if (!campground) {
            req.flash('error', `That campground doesn't exist`)
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/show', { campground })
    }
))

router.get('/:id/edit', isLoggedIn, catchAsync(
    async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id)
        res.render('campgrounds/edit', { campground })
    }
))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(
    async (req, res) => {
        const { id } = req.params
        await Campground.findByIdAndDelete(id)
        req.flash('success', 'successfully deleted campground')
        res.redirect('/campgrounds')
    }
))

module.exports = router