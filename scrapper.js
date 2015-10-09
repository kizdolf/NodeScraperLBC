'use strict';

var request = require('request'), //get body
cheerio 	= require('cheerio'), //parse it like Jquery
nodemailer 	= require('nodemailer'), //send mail
conf		= require('./conf').conf, //that's you!
ids 		= {}, //keep track of what's already sended

transporter = nodemailer.createTransport({
    service: 'Gmail', //you want something else? deal with it.
    auth: conf.gmail
}),

send_mail = function(apparts){
	var plural = (apparts.length > 1) ? ' appartements' : ' appartement', //funk. or Useless?
	html = "<ul>";
	apparts.forEach(function(one){
		html += '<li><span style="line-height:24px; font-size:18px;">' + one.price + ' : <a href="' + one.href + '">' +  one.title + '</a><small>  -- (' + one.upload + ')</small></span>';
		html += '<small><ul style="width:30%; flaot:left;">';
		one.labels.forEach(function(l, i){
			l = l.replace(new RegExp('�', 'g'), 'é'); //jshint ignore:line
			html+= '<li>' + l + one.values[i] + '</li>';
		});
		html += '</ul></small>';
		html += '<hr style="clear:both">';
		html += '</li><br>';
	});
	html += '</ul>';
	transporter.sendMail({
	    from: conf.gmail.user, //from you
	    to: conf.gmail.user, //to you
	    subject: apparts.length + plural + ' à regarder!',
	    html: html
	}, function(error){ if(error) console.log(error); });
},

suck_this_flat = function(link, price, cb){
 	var href 	= link.attribs.href,
	id_offre 	= href.split('/')[4].split('.')[0];

	if(href.indexOf('locations') !== -1 && !ids[id_offre]){
		ids[id_offre] = 1;
		var flat = { price: price, href: href, title: link.attribs.title, labels: [], values: [] };
		request({uri: href, encoding: null}, function(err, resp, body){
			if(err) return cb(err, false);
			else{
				var $ 		= cheerio.load(body),
				crits 		= $('.criterias'),
				criteres	= cheerio.load(crits.html()),
				labels 		= criteres('tr').find('th'),
				values 		= criteres('tr').find('td');

				flat.desc 	= $('.content').html();
				flat.upload = $('.upload_by').html().split('</a>')[1].split('-')[1];

				labels.each(function(i, label){ flat.labels.push(label.children[0].data); });
				values.each(function(i, value){ flat.values.push(value.children[0].data); });
				return cb(false, flat);
			}
		});
	}else return cb(false, false);
},

scrap = function(){
	request({uri: conf.url_offres}, function(error, response, body) {
		if (!error){
			var apparts = [],
			prix 		= [],
			list 		= cheerio.load(body)('.list-lbc'),
			links 		= list.find('a'), //get links
			prices 		= list.find('.price'), //get prices
			count 		= links.length;
			prices.each(function(i, price){ prix.push(price.children[0].data.trim()); });
			links.each(function(i, link){
				suck_this_flat(link, prix[i], function(err, flat){
					count--;
					if(!err && flat !== false) apparts.push(flat) && count || apparts.length > 0 && send_mail(apparts); //jshint ignore:line
				});
			});
		}else console.log('error requesting body page : ' + error);
	});
};

//	start srcapping.
scrap();
setInterval(function(){	scrap();}, conf.sec * 1000);
