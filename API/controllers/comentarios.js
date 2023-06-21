var Comentario = require('../models/comentarios')

module.exports.addComment = c => {
    return Comentario.find()
        .then(resposta => {
            id=parseInt(resposta.sort((a, b) => (parseInt(a['_id']) > parseInt(b['_id'])) ? 1 : -1)[resposta.length-1]['_id'])+1
            c['_id']=id.toString()

            return Comentario.create(c)
                .then(resposta => {
                    return resposta
                })
                .catch(erro => {
                    return erro
                })
        })
        .catch(erro => {
            return erro
        })
}

module.exports.getComments = id => {
    //console.log("id")
    //console.log(id)

    return Comentario.find({"rua": id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}
