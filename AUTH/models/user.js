const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    name:String,
    email:String,
    dateCreated:String,
    //profilepicture:String,
    role:String,
    active:Boolean
})
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema)