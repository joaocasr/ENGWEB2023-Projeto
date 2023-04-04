var mongoose = require('mongoose')


var entidadeSchema = new mongoose.Schema({
    '@tipo': String,
    '#text': String
})

var paraSchema = new mongoose.Schema({
    lugar: [String],
    data: [String],
    entidade: entidadeSchema,
    '#text': String  
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

var casasSchema = new mongoose.Schema({
    casa: [casaSchema]
})

var imagemSchema = new mongoose.Schema({
    '@path': String
})

var figuraSchema = new mongoose.Schema({
    '@id': String,
    imagem: imagemSchema,
    legenda: String
})

var mapaSchema = new mongoose.Schema({
    _id : String,
    nome: String,
    para: [paraSchema],
    'lista-casas': casasSchema,
    figura: [figuraSchema]
})

module.exports = mongoose.model('streets',mapaSchema)