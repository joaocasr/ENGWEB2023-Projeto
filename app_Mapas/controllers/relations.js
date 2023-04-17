var Relations = require('../models/relations')


module.exports.getRelatedStreets = id => {
    return Relations.findOne({"_id":id},{"lugares":1,"data":1,"entidades":1})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

