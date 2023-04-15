import xmltodict
import json
import re
import os

def aux_tratamento_para(p):
    if type(p) is dict:
        if 'lugar' in p:
            if type(p['lugar']) is not list:
                p['lugar'] = [p['lugar']]
            for en in p['lugar']:
                if '@norm' in en:
                    en['norm']=en.pop('@norm')
        if 'entidade' in p:
            print("oi2")
            if type(p['entidade']) is not list:
                p['entidade'] = [p['entidade']]
                print("ola")
            for en in p['entidade']:
                if '#text' in en:
                    print("oi")
                    en['text']=en.pop('#text')
                if '@tipo' in en:
                    en['tipo']=en.pop('@tipo')
                if '@entidade' in en:
                    en['tipo']=en.pop('@entidade')
        if 'data' in p:
            if type(p['data']) is not list:
                p['data'] = [p['data']]
        if '#text' in p:
            p['text'] = p.pop('#text')

with open("streetdb.json", "w",encoding='utf-8') as output:
    output.write("[\n")

path= os.getcwd() + "/texto"
size = len(os.listdir(path))
nfiles=0
for file in os.listdir(path):
    xmlfile = os.path.join(path,file)
    #print(xmlfile)

    finalDic = dict()

    with open(xmlfile,"r",encoding='utf-8')as f:
        xmltext = f.read()

        dic = xmltodict.parse(xmltext)
        numero = dic['rua']['meta']['número']
        nome = dic['rua']['meta']['nome']
        dic['rua']['corpo']['_id'] = numero
        dic['rua']['corpo']['nome'] = nome
        dic['rua'].pop('meta')
        #jsonobj = json.dumps(dic, indent=4,ensure_ascii=False)
        
    with open(xmlfile,"r",encoding='utf-8') as f:
        xml = f.read()
        t1 = re.sub(r'<lugar>((?:.|\n)*?)<\/lugar>',r"<a href='#\1'>\1</a>",xml)    
        t2 = re.sub(r'<data>((?:.|\n)*?)<\/data>',r"<a href='#\1'>\1</a>",t1)
        t3 = re.sub(r'<entidade.*?>((?:.|\n)*?)<\/entidade>',r"<a href='#\1'>\1</a>",t2)
        t4 = re.findall(r'<para>((?:.|\n)*?)<\/para>',t3)
        i=0
        
        if 'para' in dic['rua']['corpo']:
            for p in dic['rua']['corpo']['para']:
                if(len(dic['rua']['corpo']['para'][i])<=3):
                    dic['rua']['corpo']['para'][i]['text']=t4[i]
                    dic['rua']['corpo']['para'][i].pop('#text')
                else:
                    entryText = {
                                    "text":t4[i]
                                }
                    dic['rua']['corpo']['para'][i]=entryText
                i+=1
                aux_tratamento_para(p)
            j=0

        if 'lista-casas' in dic['rua']['corpo']:
            #print(dic['rua']['corpo']['lista-casas']['casa'])

            if type(dic['rua']['corpo']['lista-casas']) is dict:
                if type(dic['rua']['corpo']['lista-casas']['casa']) is not list:
                    dic['rua']['corpo']['listacasas'] = [dic['rua']['corpo']['lista-casas']['casa']]
                else:
                    dic['rua']['corpo']['listacasas'] = dic['rua']['corpo']['lista-casas']['casa']
                dic['rua']['corpo'].pop('lista-casas')

            while i in range(0,len(t4)):#for p in dic['rua']['corpo']['lista-casas']['casa']:
                #print("\n>>"+str(i))                
                #print(t4[i])

                if('desc' in dic['rua']['corpo']['listacasas'][j] and dic['rua']['corpo']['listacasas'][j]['desc']!=None):
                    #print(dic['rua']['corpo']['lista-casas'][j])
                    if(type(dic['rua']['corpo']['listacasas'][j]['desc']['para']) is dict):
                        #print(dic['rua']['corpo']['lista-casas'][j]['desc']['para'])
                        dic['rua']['corpo']['listacasas'][j]['desc']['para']['text']=t4[i]
                        dic['rua']['corpo']['listacasas'][j]['desc']['para'].pop('#text')
                        i+=1
                    if(type(dic['rua']['corpo']['listacasas'][j]['desc']['para']) is str):
                        entryText = {
                            "text":t4[i]
                        }
                        dic['rua']['corpo']['listacasas'][j]['desc']['para']=entryText
                        i+=1
                else:
                    entryDesc = {
                                    "text":None
                                }
                    dic['rua']['corpo']['listacasas'][j]['desc']=entryDesc

                if(len(dic['rua']['corpo']['listacasas'])>j and type(dic['rua']['corpo']['listacasas'][j]) is dict):
                    if('enfiteuta' in dic['rua']['corpo']['listacasas'][j]):
                        if not dic['rua']['corpo']['listacasas'][j]['enfiteuta']:
                            dic['rua']['corpo']['listacasas'][j].pop('enfiteuta')
                    if('foro' in (dic['rua']['corpo']['listacasas'][j])):
                        if not dic['rua']['corpo']['listacasas'][j]['foro']:
                            dic['rua']['corpo']['listacasas'][j].pop('foro')
                    if('desc' in (dic['rua']['corpo']['listacasas'][j])):
                        if('para' in (dic['rua']['corpo']['listacasas'][j]['desc'])):
                            p = dic['rua']['corpo']['listacasas'][j]['desc']['para']
                            aux_tratamento_para(p)
                j+=1

        if 'figura' in dic['rua']['corpo']:
            if type(dic['rua']['corpo']['figura']) is not list:
                dic['rua']['corpo']['figura'] = [dic['rua']['corpo']['figura']]
            for fig in dic['rua']['corpo']['figura']:
                fig['path']=re.sub(r'\.\./i',r"i",fig['imagem']['@path'])
                fig.pop('imagem')
                fig['id']=fig.pop('@id')

    #print(dic['rua']['corpo'].items())
    for (k,v) in dic['rua']['corpo'].items():
        finalDic[k] = v

    #print(t4)

    jsonobj = json.dumps(finalDic, indent=4,ensure_ascii=False)
    nfiles+=1

    with open("streetdb.json", "a",encoding='utf-8') as output:
        output.write(jsonobj)
        if(nfiles!=size):output.write(",\n")
    

with open("streetdb.json", "a",encoding='utf-8') as output:
    output.write("]")


#for c in dic['rua']['corpo']:
#    print(c)
