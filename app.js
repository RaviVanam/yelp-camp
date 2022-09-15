if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const ejsMateEngine = require('ejs-mate')
const app = express()
const path = require('path')
const port = 3333
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const campgroundRouter = require('./routes/campgrounds')
const reviewRouter = require('./routes/reviews')
const usersRouter = require('./routes/users')
const User = require('./models/user')

// mongoose connection
const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected')
})
mongoose.connect('mongodb://localhost:27017/yelp-camp')


// setting app config
app.engine('ejs', ejsMateEngine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


// pre router middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisisnotasafesecretatall',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expries: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


// temp stuff


// routes
app.use('/', usersRouter)
app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/reviews', reviewRouter)


// error throwing
app.all('*', (req, res, next) => {
    throw new ExpressError('Page not found', 404)
})


// error handling
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(port, (first) => {
    console.log(`listening on port ${port}`)
})