const express = require('express')
const mongoose = require('mongoose')
const ejsMateEngine = require('ejs-mate')
const app = express()
const path = require('path')
const port = 3333
const Campground = require('./models/campgrounds.js')
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected')
})

mongoose.connect('mongodb://localhost:27017/yelp-camp')

app.engine('ejs', ejsMateEngine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', catchAsync(
    async (req, res, next) => {
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', { campgrounds })
    }
))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', catchAsync(
    async (req, res, next) => {
        if (!req.body.campground) throw new ExpressError('Invalid data', 400)
        const newCampground = new Campground(req.body.campground)
        await newCampground.save()
        res.redirect(`/campgrounds/${newCampground._id}`)
    }
))

app.put('/campgrounds/:id', catchAsync(
    async (req, res) => {
        const { id } = req.params
        await Campground.findByIdAndUpdate(id, req.body.campground)
        res.redirect(`/campgrounds/${id}`)
    }
))

app.get('/campgrounds/:id', catchAsync(
    async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id)
        res.render('campgrounds/show', { campground })
    }
))

app.get('/campgrounds/:id/edit', catchAsync(
    async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id)
        res.render('campgrounds/edit', { campground })
    }
))

app.delete('/campgrounds/:id', catchAsync(
    async (req, res) => {
        const { id } = req.params
        await Campground.findByIdAndDelete(id)
        res.redirect('/campgrounds')
    }
))

app.all('*', (req, res, next) => {
    throw new ExpressError('Page not found', 404)
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(port, (first) => {
    console.log(`listening on port ${port}`)
})