var mongoose = require('mongoose')


var userSchema = new mongoose.Schema({
    username: String,
    photo: String 
})

var commentSchema = new mongoose.Schema({
    _id : Number,
    dateTime: String,
    autor: userSchema,
    rua: String,
    p: String
})

module.exports = mongoose.model('comentarios',commentSchema)