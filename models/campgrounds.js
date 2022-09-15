const mongoose = require('mongoose')
const Review = require('./reviews')
const Schema = mongoose.Schema
const { cloudinary } = require('../cloudinary')

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'author is required']
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

campgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })

        if (doc.images) {
            for (let image of doc.images) {
                await cloudinary.uploader.destroy(image.filename)
            }
        }
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)