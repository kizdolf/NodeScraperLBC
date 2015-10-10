'use strict';

exports.conf = {
	urls:{
		pap:[
			'http://www.pap.fr/annonce/locations-appartement-paris-75-g439-a-partir-du-2-pieces-jusqu-a-900-euros-40-annonces-par-page'
		],
		lbc:[
			'http://www.leboncoin.fr/locations/offres/ile_de_france/paris/?f=a&th=1&mrs=600&mre=900&sqs=3&ros=2'
		]
	},
	gmail:{
		user: 'mail@gmail.com',
		pass: 'password' // voir https://security.google.com/settings/security/apppasswords
	},
	sec: 60 //scrapper toutes les 60 secondes.
};
