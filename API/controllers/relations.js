var Relations = require('../models/relations')


module.exports.addRelatedStreets =async(related) => {
    console.log("controller- relations 1")
    console.log(related)
    try{
        console.log("controller- relations 2")
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

