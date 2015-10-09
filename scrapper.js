'use strict'

// TO EDIT	
var conf = {
	url_offres : 'http://www.leboncoin.fr/locations/offres/ile_de_france/paris/?f=a&th=1&mrs=600&mre=900&sqs=3&ros=2',
	gmail:{
		user: 'mail@gmail.com',
		pass: 'password' // voir https://security.google.com/settings/security/apppasswords
	},
	sec: 60 //scrapper toutes les 60 secondes.
};
// END EDIT

var request = require('request'); //get body
var cheerio = require('cheerio'); //parse it like Jquery
var nodemailer = require('nodemailer'); //send mail
var ids = []; //keep track of what's already sended

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: conf.gmail
});

var send_mail = function(apparts){
	var plural = (apparts.length > 1) ? ' appartements' : ' appartement'; //funk. or Useless?
	var html = "<ul>";
	apparts.forEach(function(one){
		html += '<li style="line-height:24px; font-size:18px;">' + one.price + ' : <a href="' + one.href + '">' +  one.title + '</a></li><br>';
	});
	html += '</ul>';
	transporter.sendMail({
	    from: conf.gmail.user, //from you 
	    to: conf.gmail.user, //to you
	    subject: apparts.length + plural + ' à regarder!', 
	    html: html
	}, function(error, info){
	    if(error) console.log(error);
	    else console.log('Message sent: ' + info.response + ' à ' + new Date());
	});
};

var scrap = function(){
	request({uri: conf.url_offres}, function(error, response, body) {
		if (!error){
			var apparts = [],
			prix = [],
			$ = cheerio.load(body),
			list = $('.list-lbc'),
			links = list.find('a'), //get links
			prices = list.find('.price'); //get prices
			prices.each(function(i, price){
				prix.push(price.children[0].data.trim());
			});
			links.each(function(i, link){
				var util = link.attribs,
				id = util.href.split('/')[4].split('.')[0];
				util.price = prix[i]; //href and prices have the same index. Easy :)
				if(util.href.indexOf('locations') !== -1 && ids.indexOf(id) === -1){
					apparts.push(util);
					ids.push(id);
				}
			});
			if(apparts.length > 0) send_mail(apparts);
			else console.log(new Date() + ' Rien de nouveau à envoyer.');
		}else console.log('error requesting body page : ' + error);
	});
};

scrap();
setInterval(function(){
	scrap();
}, conf.sec * 1000);