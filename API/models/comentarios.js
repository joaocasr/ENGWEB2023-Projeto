var mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    _id : Number,
    dateTime: String,
    username: String,
    photo: String,
    rua: Number,
    p: String
})

module.exports = mongoose.model('comentarios',commentSchema)