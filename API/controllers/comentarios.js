var Comentario = require('../models/comentarios')

module.exports.addComment = c => {
    return Comentario.create(c)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.getComentarios = id => {
    return Comentario.find({rua: id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}
