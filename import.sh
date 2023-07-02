#!/bin/bash

# container name: charming_albattani with mongo image
docker cp data/streetdb.json charming_albattani:tmp/streetdb.json

docker cp data/relationsdb.json charming_albattani:tmp/relationsdb.json

docker cp data/user.json charming_albattani:tmp/user.json

docker cp data/comentarios.json charming_albattani:tmp/comentarios.json


sudo docker exec charming_albattani mongoimport -d MapaBraga -c streets --file /tmp/streetdb.json --jsonArray

sudo docker exec charming_albattani mongoimport -d MapaBraga -c relations --file /tmp/relationsdb.json --jsonArray

sudo docker exec charming_albattani mongoimport -d MapaBraga -c users --file /tmp/user.json --jsonArray

sudo docker exec charming_albattani mongoimport -d MapaBraga -c comentarios --file /tmp/comentarios.json --jsonArray