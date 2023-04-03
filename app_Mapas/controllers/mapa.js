var Mapa = require('../models/mapa')

// Student list
module.exports.list = () => {
    return Mapa.find()
            .sort({nome:-1})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}