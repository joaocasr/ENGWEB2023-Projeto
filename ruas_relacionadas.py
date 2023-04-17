import json

def inf_relaçao(estradas):
    new_estradas=[]
    for estrada in estradas:
        lugares=[]
        entidades=[]
        data=[]
        if 'para' in estrada:
            for p in range(len(estrada['para'])):
                if 'lugar' in estrada['para'][p]:
                    for l in estrada['para'][p]['lugar']:
                        lugares.append(l)
                if 'data' in estrada['para'][p]:
                    for d in estrada['para'][p]['data']:
                        data.append(d)
                if 'entidade' in estrada['para'][p]:
                    for e in estrada['para'][p]['entidade']:
                        entidades.append(e)
        estrada={'_id':estrada['_id'],'nome':estrada['nome'],'lugares':lugares,'data':data,'entidades':entidades}
        new_estradas.append(estrada)

    return new_estradas

def estradas_rel(estradas):
    estradas_relacionadas = []
    for estrada in estradas:
        new_estrada={'_id':estrada['_id'],'nome':estrada['nome'],'lugares':[],'data':[],'entidades':[]}
        estradas_relacionadas.append(new_estrada)

    for i in range(len(estradas)):
        for j in range(i,len(estradas)):
            if 'lugares' in estradas[i] and 'lugares' in estradas[j] and i != j:
                for lugar in estradas[i]['lugares'] :
                    if lugar in estradas[j]['lugares']:
                        estradas_relacionadas[i]['lugares'].append({'id':estradas_relacionadas[j]['_id'],'nome':estradas_relacionadas[j]['nome'],'atributo':lugar})
                        estradas_relacionadas[j]['lugares'].append({'id':estradas_relacionadas[i]['_id'],'nome':estradas_relacionadas[j]['nome'],'atributo':lugar})
                        break
            if 'data' in estradas[i] and 'data' in estradas[j] and i != j:
                for data in estradas[i]['data'] :
                    if data in estradas[j]['data']:
                        estradas_relacionadas[i]['data'].append({'id':estradas_relacionadas[j]['_id'],'nome':estradas_relacionadas[j]['nome'],'atributo':data})
                        estradas_relacionadas[j]['data'].append({'id':estradas_relacionadas[i]['_id'],'nome':estradas_relacionadas[j]['nome'],'atributo':data})
                        break
            if 'entidades' in estradas[i] and 'entidades' in estradas[j] and i != j:
                for entidade_i in estradas[i]['entidades'] :
                    for entidade_j in estradas[j]['entidades'] :
                        if entidade_i['text'] == entidade_j['text'] and entidade_i['tipo'] == entidade_j['tipo']:
                            estradas_relacionadas[i]['entidades'].append({'id':estradas_relacionadas[j]['_id'],'nome':estradas_relacionadas[j]['nome'],'atributo':entidade_i})
                            estradas_relacionadas[j]['entidades'].append({'id':estradas_relacionadas[i]['_id'],'nome':estradas_relacionadas[j]['nome'],'atributo':entidade_i})
                            break
    
    return(estradas_relacionadas)

def create_reldb():
    json_file = open("streetdb.json", "r",encoding='utf-8')
    json_str = json_file.read()
    estradas = json.loads(json_str)

    estradas = inf_relaçao(estradas)
    estradas_relacionadas = estradas_rel(estradas)

    jsonobj = json.dumps(estradas_relacionadas, indent=4,ensure_ascii=False)
    with open("streets_relationsdb.json", "w",encoding='utf-8') as output:
        output.write(jsonobj)

create_reldb()