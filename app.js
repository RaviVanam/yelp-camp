const express = require('express')
const mongoose = require('mongoose')
const ejsMateEngine = require('ejs-mate')
const app = express()
const path = require('path')
const port = 3333
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const campgroundRouter = require('./routes/campgrounds')
const reviewRouter = require('./routes/reviews')

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
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/reviews', reviewRouter)


app.get('/', (req, res) => {
    res.render('home')
})



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