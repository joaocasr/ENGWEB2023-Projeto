var mongoose = require('mongoose')


var entidadeSchema = new mongoose.Schema({
    tipo: String,
    text: String
})

var paraSchema = new mongoose.Schema({
    lugar: [String],
    data: [String],
    entidade: [entidadeSchema],
    text: String  
})

var descSchema = new mongoose.Schema({
    para: paraSchema
})

var casaSchema = new mongoose.Schema({
    'número': String,
    enfiteuta: String,
    foro: String,
    desc: descSchema
})

var figuraSchema = new mongoose.Schema({
    id: String,
    legenda: String,
    path: String
})

var mapaSchema = new mongoose.Schema({
    _id : String,
    nome: String,
    para: [paraSchema],
    'lista-casas': [casaSchema],
    figura: [figuraSchema]
})

module.exports = mongoose.model('streets',mapaSchema)