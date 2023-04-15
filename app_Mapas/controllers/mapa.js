var Mapa = require('../models/mapa')
const { getStreetspara } = require('../public/javascripts/para')

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

module.exports.getRua = id => {
    return Mapa.findOne({_id: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.addRua = a => {
    return Mapa.create(a)
            .then(dados => {
                return dados
            })
            .catch(erro => {
                return erro
            })
}

module.exports.updateMapa = a => {
    return Mapa.updateOne({_id: a._id}, a)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.deleteRua = id => {
    return Mapa.deleteOne({_id: id})
            .then(resposta => {
                return resposta.data
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getRelatedLugares = lugar => {
    return Mapa.find({"para": {"$elemMatch": {"lugar": {"$in": [lugar]}}}})
            .then(streets => {
                return streets
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getRelatedDatas= data => {
    return Mapa.find({"para": {"$elemMatch": {"data": {"$in": [data]}}}})
            .then(streets => {
                return streets
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getRelatedEntidades= entity => {
    return Mapa.find({"para": {"$elemMatch": {"entidade": {"$elemMatch": {"text":entity}}}}})
            .then(streets => {
                return streets
            })
            .catch(erro => {
                return erro
            })
}