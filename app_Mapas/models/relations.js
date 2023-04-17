var mongoose = require('mongoose')


var atributoSchema = new mongoose.Schema({
    text: String,
    tipo: String
})

var entidadeSchema = new mongoose.Schema({
    id : String,
    nome: String,
    atributo: atributoSchema
})

var dataSchema = new mongoose.Schema({
    id : String,
    nome: String,
    atributo: String
})

var lugarSchema = new mongoose.Schema({
    id : String,
    nome: String,
    atributo: String
})


var mapaSchema = new mongoose.Schema({
    _id : String,
    nome: String,
    lugares: [lugarSchema],
    data: [dataSchema],
    entidades: [entidadeSchema]
})

module.exports = mongoose.model('relations',mapaSchema)