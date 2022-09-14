const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        required: [true, 'author is required'],
        ref: 'User'
    }
})

module.exports = mongoose.model('Review', reviewSchema)