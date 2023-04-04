var Mapa = require('../models/mapa')

// Mapa list
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

module.exports.getMapa = id => {
    return Mapa.findOne({_id: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.addAluno = a => {
    return Mapa.create(a)
            .then(dados => {
                return dados
            })
            .catch(erro => {
                return erro
            })
}

module.exports.updateAluno = a => {
    return Mapa.updateOne({_id: a._id}, a)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.deleteAluno = id => {
    return Mapa.deleteOne({_id: id})
            .then(resposta => {
                return resposta.data
            })
            .catch(erro => {
                return erro
            })
}
