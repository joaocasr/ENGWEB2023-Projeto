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
                if 'entidades' in estrada['para'][p]:
                    for e in estrada['para'][p]['entidades']:
                        lugares.append(e)
        estrada={'_id':estrada['_id'],'lugares':lugares,'data':data,'entidades':entidades}
        new_estradas.append(estrada)
    return new_estradas

def estradas_rel(estradas):
    estradas_relacionadas = []
    for estrada in estradas:
        new_estrada={'_id':estrada['_id'],'lugares':[],'data':[],'entidades':[]}
        estradas_relacionadas.append(new_estrada)

    for i in range(len(estradas)):
        for j in range(i,len(estradas)):
            if 'lugares' in estradas[i] and 'lugares' in estradas[j] :
                for lugar in estradas[i]['lugares'] :
                    if lugar in estradas[j]['lugares']:
                        estradas_relacionadas[i]['lugares'].append(j)
                        estradas_relacionadas[j]['lugares'].append(i)
                        break
    
    print(estradas_relacionadas)

def main():
    json_file = open("streetdb.json", "r",encoding='utf-8')
    json_str = json_file.read()
    estradas = json.loads(json_str)
    estradas = inf_relaçao(estradas)
    estradas_relacionadas = estradas_rel(estradas)

main()