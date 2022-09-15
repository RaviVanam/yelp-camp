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
            images: [
                {
                    url: 'https://res.cloudinary.com/iamvr/image/upload/v1663270011/YelpCamp/dqqbaraexq5ccgqo8fxe.jpg',
                    filename: 'YelpCamp/dqqbaraexq5ccgqo8fxe',
                },
                {
                    url: 'https://res.cloudinary.com/iamvr/image/upload/v1663270103/YelpCamp/gob25sgiwsptm3jdapqt.jpg',
                    filename: 'YelpCamp/gob25sgiwsptm3jdapqt',
                }
            ],
            price: randomPrice(),
            author: '6321b932ad34ef970f8312dd',
        })
    }

    await Campground.insertMany(camps)
    console.log('done')
}
seedDB()