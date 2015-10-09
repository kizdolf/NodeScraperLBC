'use strict';

exports.conf = {
    url_offres : 'http://www.leboncoin.fr/locations/offres/ile_de_france/paris/?f=a&th=1&mrs=600&mre=900&sqs=3&ros=2',
	gmail:{
		user: 'mail@gmail.com',
		pass: 'password' // voir https://security.google.com/settings/security/apppasswords
	},
	sec: 60 //scrapper toutes les 60 secondes.
};
