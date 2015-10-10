## Scrapper le bon coin / pap.

check leboncoin et pap pour vous.
En nodeJS, avec une micro-db en JSON.

il est possible de scrapper plusieurs urls chez leboncoin ou pap, rajouter les dans les arrays prévus pour ça. 
Cependant comme je suis encore en train de dev tout ça un mail est envoyé pour chaque fichier.

**TODO: add multi email , merge offers in one object before send mail.**

-------

####1) Install :

* npm install

* npm install -g forever

####2) Params:

* Edit conf.js

####3) Launch:

* forever start scrapper.js

-----

## Ajouter un scrapper ? 

**1)** Ajouter le nom et les urls associés dans conf.js, objet urls, le nom donné servira de référence
**2)** Ajouter un fichier dans le dossier scrappers. Le fichier DOIT avoir le même nom que dans conf.js
**3)** Le fichier doit avoir une méthode scrap exporté, qui sera appelé comme callback de request. 
Prototype de la fonction scrap: function(err, resp, body). Le retour n'est pas observé. 
Pour envoyer les offres par mail appeler la fonction send_mail de scrapper.js avec les arguments suivants: 
```
apparts: [{
	price: string,
	href: string, // url pour accéder à l'offre 
	title: string, // valeur du lien
	upload: false || string, // si string sera affiché en plus du lien
	labels: [strings], //labels des infos à afficher
	values: [strings], //values des infos à afficher. labels et values DOIVENT avoir les même index. 
},...]
```