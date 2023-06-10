var Relations = require('../models/relations')


module.exports.addRelatedStreets = async(related) => {
    console.log("controller- relations 1")
    console.log(related)
    try{
        const data = await Relations.create(related)
        console.log(data)
        return data
    }
    catch(erro){
            return erro
    }
}

module.exports.getRelatedStreets = id => {
    return Relations.findOne({"_id":id},{"lugares":1,"data":1,"entidades":1})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}


module.exports.addInverseRelatedLugares = obj => {
    return Relations.updateOne({"_id":obj.id},{$push:{lugares:{id:obj.nid,nome:obj.nome,atributo:obj.atributo}}})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.addInverseRelatedData = obj => {
    return Relations.updateOne({"_id":obj.id},{$push:{data:{id:obj.nid,nome:obj.nome,atributo:obj.atributo}}})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.addInverseRelatedEntidades = obj => {
    return Relations.updateOne({"_id":obj.id},{$push:{entidades:{id:obj.nid,nome:obj.nome,atributo:obj.atributo}}})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}
