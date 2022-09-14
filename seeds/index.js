const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected')
})

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const sample = array => array[Math.floor(Math.random() * array.length)]
const randomPrice = () => Math.floor(Math.random() * 1000)

const seedDB = async () => {
    await Review.deleteMany({})
    await Campground.deleteMany({})
    const camps = []
    for (city of cities) {
        camps.push({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: city.name,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae aliquam debitis voluptate quisquam minima beatae dolores fugiat, hic molestias facere? Cumque assumenda beatae animi facere, omnis error deserunt officia accusamus?',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
            price: randomPrice(),
            author: '6321b932ad34ef970f8312dd',
        })
    }

    await Campground.insertMany(camps)
    console.log('done')
}
seedDB()