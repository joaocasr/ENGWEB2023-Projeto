var Mapa = require('../../controllers/mapa')
var Relations = require('../../controllers/relations')


exports.getStreetspara = async function(rua){
    const related ={
        "_id":rua._id,
        nome:rua.nome,
        lugares: [],
        data: [],
        entidades: []
    }
    if(rua.para){
        for(let p=0;p<rua.para.length;p+=1){
            if(rua.para[p].lugar){
                for(let l=0;l<rua.para[p].lugar.length;l+=1){
                    try {
                        const lugares = await Mapa.getRelatedLugares(rua.para[p].lugar[l]);
                        for (let i = 0; i < lugares.length; i++) {
                            if(related.lugares.filter(n => n.nome == lugares[i].nome).length == 0 && rua.nome!=lugares[i].nome){
                                related.lugares.push({id:lugares[i]._id,nome:lugares[i].nome,atributo:rua.para[p].lugar[l]})
                                await Relations.addInverseRelatedLugares({id:lugares[i]._id,nid:rua._id,nome:rua.nome,atributo:rua.para[p].lugar[l]})
                            }
                        }
                    }catch(erro) {
                       console.log("Erro na obtenção das ruas relacionadas. "+erro)
                    }         
                }
            }
            if(rua.para[p].data){
                for(let l=0;l<rua.para[p].data.length;l+=1){
                    try {
                        const datas = await Mapa.getRelatedDatas(rua.para[p].data[l]);
                        for (let i = 0; i < datas.length; i++) {
                            if(related.data.filter(n => n.nome == datas[i].nome).length == 0 && rua.nome!=datas[i].nome){
                                related.data.push({id:datas[i]._id,nome:datas[i].nome,atributo:rua.para[p].data[l]})
                                await Relations.addInverseRelatedData({id:datas[i]._id,nid:rua._id,nome:rua.nome,atributo:rua.para[p].data[l]})
                            }
                        }
                    }catch(erro) {
                       console.log("Erro na obtenção das ruas relacionadas. "+erro)
                    }         
                }
            }
            if(rua.para[p].entidade){
                for(let l=0;l<rua.para[p].entidade.length;l+=1){
                    try {
                        const entidades = await Mapa.getRelatedEntidades(rua.para[p].entidade[l].text);
                        for (let i = 0; i < entidades.length; i++) {
                            if(related.entidades.filter(n => n.nome == entidades[i].nome).length == 0 && rua.nome!=entidades[i].nome){
                                related.entidades.push({id:entidades[i]._id,nome:entidades[i].nome,atributo:rua.para[p].entidade[l].text})
                                await Relations.addInverseRelatedEntidades({id:entidades[i]._id,nid:rua._id,nome:rua.nome,atributo:rua.para[p].entidade[l].text})
                            }
                        }
                    }catch(erro) {
                       console.log("Erro na obtenção das ruas relacionadas. "+erro)
                    }         
                }
            }

        }
    }
    return related
}