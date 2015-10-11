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
				'mailTo@mail.com',
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
				}
			]
		}
	],
	gmail:{ //TODO: transform this to send from a smtp server
		user: 'user@gmail.com',
		pass: 'password' // voir https://security.google.com/settings/security/apppasswords
	},
	sec: 60 //scrapper toutes les 60 secondes.
};
