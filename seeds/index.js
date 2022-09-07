const mongoose = require('mongoose')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')
const Campground = require('../models/campgrounds')

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected')
})

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const sample = array => array[Math.floor(Math.random() * array.length)]
const randomPrice = () => Math.floor(Math.random() * 1000)

const seedDB = async () => {
    await Campground.deleteMany({})
    const camps = [] 
    for (city of cities) {
        camps.push({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: city.name,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae aliquam debitis voluptate quisquam minima beatae dolores fugiat, hic molestias facere? Cumque assumenda beatae animi facere, omnis error deserunt officia accusamus?',
            image: 'https://source.unsplash.com/collection/6820',
            price: randomPrice(), 
        })
    }

    await Campground.insertMany(camps)
    console.log('done')
}
seedDB()