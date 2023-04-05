import xmltodict
import json
import re
import os

with open("streetdb.json", "a",encoding='utf-8') as output:
    output.write("[\n")

path= os.getcwd() + "/texto"
size = len(os.listdir(path))
nfiles=0
for file in os.listdir(path):
    xmlfile = os.path.join(path,file)
    print(xmlfile)

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
        t1 = re.sub(r'<lugar>(.*?)<\/lugar>',r"\1",xml)    
        t2 = re.sub(r'<data>(.*?)<\/data>',r"\1",t1)
        t3 = re.sub(r'<entidade.*?>(.*?)<\/entidade>',r"\1",t2)
        t4 = re.findall(r'<para>(.*?)<\/para>',t3)
        i=0
        
        if 'para' in dic['rua']['corpo']:
            for p in dic['rua']['corpo']['para']:
                if(len(dic['rua']['corpo']['para'][i])<=3):
                    dic['rua']['corpo']['para'][i]['#text']=t4[i]
                else:
                    entryText = {
                                    "#text":t4[i]
                                }
                    dic['rua']['corpo']['para'][i]=entryText
                i+=1
                if type(p) is dict:
                    if 'lugar' in p:
                        if type(p['lugar']) is not list:
                            p['lugar'] = [p['lugar']]
                    if 'entidade' in p:
                        if type(p['entidade']) is not list:
                            p['entidade'] = [p['entidade']]
                    if 'data' in p:
                        if type(p['data']) is not list:
                            p['data'] = [p['data']]
            j=0
        if 'lista-casas' in dic['rua']['corpo']:
            print(dic['rua']['corpo']['lista-casas']['casa'])

            if type(dic['rua']['corpo']['lista-casas']) is dict:
                if type(dic['rua']['corpo']['lista-casas']['casa']) is not list:
                    dic['rua']['corpo']['lista-casas'] = [dic['rua']['corpo']['lista-casas']['casa']]
                else:
                    dic['rua']['corpo']['lista-casas'] = dic['rua']['corpo']['lista-casas']['casa']

            while i in range(0,len(t4)):#for p in dic['rua']['corpo']['lista-casas']['casa']:
                print(">>"+str(i))
                print(t4[i])

                if('desc' in (dic['rua']['corpo']['lista-casas'])):
                        #if(xmlfile=="/home/joao/XMLJSON/texto/MRB-29-Beco.xml"):print(dic['rua']['corpo']['lista-casas']['casa']['desc'])
                        entryText = {
                            "#text":t4[i]
                        }
                        dic['rua']['corpo']['lista-casas']['desc']['para']=entryText
                        i+=1   
                elif('desc' in dic['rua']['corpo']['lista-casas'][j] and dic['rua']['corpo']['lista-casas'][j]['desc']!=None):
                    #print(dic['rua']['corpo']['lista-casas']['casa'][j])
                    if(type(dic['rua']['corpo']['lista-casas'][j]['desc']['para']) is dict):
                        #print(dic['rua']['corpo']['lista-casas']['casa'][j]['desc']['para'])
                        dic['rua']['corpo']['lista-casas'][j]['desc']['para']['#text']=t4[i]
                        i+=1
                    if(type(dic['rua']['corpo']['lista-casas'][j]['desc']['para']) is str):
                        entryText = {
                            "#text":t4[i]
                        }
                        dic['rua']['corpo']['lista-casas'][j]['desc']['para']=entryText
                        i+=1
                else:
                    entryDesc = {
                                    "#text":None
                                }
                    dic['rua']['corpo']['lista-casas'][j]['desc']=entryDesc

                if(len(dic['rua']['corpo']['lista-casas'])>j and type(dic['rua']['corpo']['lista-casas'][j]) is dict):
                    if('enfiteuta' in dic['rua']['corpo']['lista-casas'][j]):
                        if not dic['rua']['corpo']['lista-casas'][j]['enfiteuta']:
                            dic['rua']['corpo']['lista-casas'][j].pop('enfiteuta')
                    if('foro' in (dic['rua']['corpo']['lista-casas'][j])):
                        if not dic['rua']['corpo']['lista-casas'][j]['foro']:
                            dic['rua']['corpo']['lista-casas'][j].pop('foro')
                    if('desc' in (dic['rua']['corpo']['lista-casas'][j])):
                        if('para' in (dic['rua']['corpo']['lista-casas'][j]['desc'])):
                            p = dic['rua']['corpo']['lista-casas'][j]['desc']['para']
                            if type(p) is dict:
                                if 'lugar' in p:
                                    if type(p['lugar']) is not list:
                                        p['lugar'] = [p['lugar']]
                                if 'entidade' in p:
                                    if type(p['entidade']) is not list:
                                        p['entidade'] = [p['entidade']]
                                if 'data' in p:
                                    if type(p['data']) is not list:
                                        p['data'] = [p['data']]
                j+=1

        if 'figura' in dic['rua']['corpo']:
            if type(dic['rua']['corpo']['figura']) is not list:
                dic['rua']['corpo']['figura'] = [dic['rua']['corpo']['figura']]
            for fig in dic['rua']['corpo']['figura']:
                fig['@path']=fig['imagem']['@path']
                fig.pop('imagem')

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
