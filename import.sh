#! /bin/bash

mongoimport --host Mapa-mongodb --db MapaBraga --collection streets --type json --file /mongo-seed/streetsdb.json --jsonArray

mongoimport --host Mapa-mongodb --db MapaBraga --collection relations --type json --file /mongo-seed/relationsdb.json --jsonArray

mongoimport --host Mapa-mongodb --db MapaBraga --collection users --type json --file /mongo-seed/user.json --jsonArray