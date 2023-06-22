import json


file = open('/home/joao/Trabalho-EngWeb2023/streetdb.json','r')
ruas = json.load(file)
i=0
for street in ruas:
    street["figurasAtuais"] = [{"name":street["nome"]+"-Vista1.JPG"}, {"name":street["nome"]+"-Vista2.JPG"}]

with open("/home/joao/Trabalho-EngWeb2023/streetdb.json", "w") as outfile:
    json.dump(ruas, outfile,indent=5, ensure_ascii=False)