var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')
var Schema = mongoose.Schema

var UserSchema = Schema({
    username:String,
    email:String,
    password:String,
    name:String,
    dateCreated:String,
    role:String,
    active:Boolean
})
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('user', UserSchema)