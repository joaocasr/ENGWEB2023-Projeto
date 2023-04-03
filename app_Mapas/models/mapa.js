var mongoose = require('mongoose')

var paraSchema = new mongoose.Schema({
    primeiro:String,
    último:String
})

var casaSchema = new mongoose.Schema({
    primeiro:String,
    último:String
})

var figuraSchema = new mongoose.Schema({
    primeiro:String,
    último:String
})

var mapaSchema = new mongoose.Schema({
    __id : String,
    nome: String,
    para: [paraSchema],
    casas: [casaSchema],
    figuras: [figuraSchema]
})

module.exports = mongoose.model('streets',mapaSchema)