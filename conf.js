'use strict';
/*
	Each object in scrappers is used separately.
	So if you want to add your own search, or multiple searches
	you just have to duplicate an object, put mails in the mailTo array
	and urls in the proper array of websites.
*/

//TODO: Transform this into a document oriented database.

exports.conf = {
	scrappers:[
		{
			mailTo:[
				'jules.buret@gmail.com',
			],
			websites:[
				{
					name: 'pap',
					urls:[
						'http://www.pap.fr/annonce/locations-appartement-paris-75-g439-a-partir-du-2-pieces-jusqu-a-900-euros-40-annonces-par-page'
					]
				},
				{
					name: 'lbc',
					urls:[
						'http://www.leboncoin.fr/locations/offres/ile_de_france/paris/?f=a&th=1&mrs=600&mre=900&sqs=3&ros=2'
					]
				},
				{
					name: 'seLoger',
					urls: [
						'http://www.seloger.com/list.htm?cp=75&idtt=1&idtypebien=1%2c2%2c9&pxmax=900&nb_pieces=2%2c3%2c4%2c5%2c5%2b#idtt=1&idtypebien=1&idtypebien=2&idtypebien=9&&pxmax=900&&tri=initial&&cp=75&&nb_pieces=2,3,4,5,5%2b'
					]
				}
			]
		},
		{
			mailTo:[
				'jules.buret@gmail.com',
				'lucas-moriniere@hotmail.com'
			],
			websites:[
				{
					name: 'pap',
					urls:[
						'http://www.pap.fr/annonce/vente-appartement-maison-paris-75-g439-a-partir-du-3-pieces-a-partir-de-2-chambres-entre-900-et-1300-euros-a-partir-de-35-m2'
					]
				},
				{
					name: 'lbc',
					urls:[
						'http://www.leboncoin.fr/locations/offres/ile_de_france/paris/?f=a&th=1&mrs=700&mre=1300&sqs=4&ros=3&ret=1&ret=2'
					]
				},
				{
					name: 'seLoger',
					urls: [
						'http://www.seloger.com/list.htm?cp=75&idtt=1&idtypebien=1%2c2&pxmax=1300&nb_pieces=3%2c4%2c5%2c5%2b#idtt=1&idtypebien=1&idtypebien=2&&pxmax=1300&&surfacemin=35&&cp=75&&nb_pieces=3,4,5,5%2b&nb_chambres=2&nb_chambres=3&nb_chambres=4&nb_chambres=5&nb_chambres=5%2b'
					]
				}
			]
		}
	],
	gmail:{ //TODO: transform this to send from a smtp server
		user: 'jules.buret@gmail.com',
		pass: 'abshlcsbluuohunq' // voir https://security.google.com/settings/security/apppasswords
	},
	sec: 60 //scrapper toutes les 60 secondes.
};
