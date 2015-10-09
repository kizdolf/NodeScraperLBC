'use strict';

var request 	= require('request'), //get body
conf			= require('./conf').conf,
cheerio 		= require('cheerio'), //parse it like Jquery
nodemailer 		= require('nodemailer'), //send mail
ids 			= {}, //keep track of what's already sended

transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: conf.gmail
}),
send_mail = function(apparts){
	var plural = (apparts.length > 1) ? ' appartements' : ' appartement', //funk. or Useless?
	html = "<ul>";
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
},
scrap = function(){
	request({uri: conf.url_offres}, function(error, response, body) {
		if (!error){
			var apparts 	= [],
			prix 			= [],
			list 			= cheerio.load(body)('.list-lbc'),
			links 			= list.find('a'), //get links
			prices 			= list.find('.price'); //get prices

			prices.each(function(i, price){
				prix.push(price.children[0].data.trim());
			});
			links.each(function(i, link){
				var util 	= link.attribs,
				id 			= util.href.split('/')[4].split('.')[0];
				util.price 	= prix[i]; //href and prices have the same index. Easy :)
				if(util.href.indexOf('locations') !== -1 && !ids[id]){
					apparts.push(util);
					ids[id] = 1;
				}
			});
			if(apparts.length > 0) send_mail(apparts);
			else console.log(new Date() + ' Rien de nouveau à envoyer.');
		}else console.log('error requesting body page : ' + error);
	});
};

//	start srcapping.
scrap();
setInterval(function(){	scrap();}, conf.sec * 1000);
