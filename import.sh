#!/bin/bash

# container name: $1 with mongo image
docker cp data/streetdb.json $1:tmp/streetdb.json

docker cp data/relationsdb.json $1:tmp/relationsdb.json

docker cp data/user.json $1:tmp/user.json

docker cp data/comentarios.json $1:tmp/comentarios.json

sudo docker exec $1 mongoimport -d MapaBraga -c streets --file /tmp/streetdb.json --jsonArray

sudo docker exec $1 mongoimport -d MapaBraga -c relations --file /tmp/relationsdb.json --jsonArray

sudo docker exec $1 mongoimport -d MapaBraga -c users --file /tmp/user.json --jsonArray

sudo docker exec $1 mongoimport -d MapaBraga -c comentarios --file /tmp/comentarios.json --jsonArray