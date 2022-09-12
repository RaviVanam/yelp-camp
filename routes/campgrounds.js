const Campground = require('../models/campgrounds.js')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const { campgroundSchema } = require('../schemas')
const { Router } = require('express')
const router = new Router()

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const message = error.details.map(detail => detail.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}

router.get('/', catchAsync(
    async (req, res, next) => {
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', { campgrounds })
    }
))

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(
    async (req, res, next) => {
        // if (!req.body.campground) throw new ExpressError('Invalid data', 400)
        const newCampground = new Campground(req.body.campground)
        await newCampground.save()
        req.flash('success', 'successfully created campground')
        res.redirect(`/campgrounds/${newCampground._id}`)
    }
))

router.put('/:id', validateCampground, catchAsync(
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
        const campground = await Campground.findById(id).populate('reviews')
        if (!campground) {
            req.flash('error', `That campground doesn't exist`)
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/show', { campground })
    }
))

router.get('/:id/edit', catchAsync(
    async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id)
        res.render('campgrounds/edit', { campground })
    }
))

router.delete('/:id', catchAsync(
    async (req, res) => {
        const { id } = req.params
        await Campground.findByIdAndDelete(id)
        req.flash('success', 'successfully deleted campground')
        res.redirect('/campgrounds')
    }
))

module.exports = router