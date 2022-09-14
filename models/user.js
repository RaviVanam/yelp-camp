const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose)

console.log(userSchema)

module.exports = mongoose.model('User', userSchema)