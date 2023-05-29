var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    name:String,
    dateCreated:String,
    //profilepicture:String,
    role:String,
    active:Boolean
})
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('user', UserSchema)