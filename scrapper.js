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
		html += '<li><span style="line-height:24px; font-size:18px;">' + one.price + ' : <a href="' + one.href + '">' +  one.title + '</a></span>';
		if(one.labels){
			html += '<small><ul>';
			one.labels.forEach(function(l, i){
				l = l.replace(new RegExp('�', 'g'), 'é'); //jshint ignore:line
				html+= '<li>' + l + one.values[i] + '</li>';
			});
			html += '</ul></small>';
		}
		html += '</li><br>';
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

suck_this_flat = function(link, price, cb){
 	var href = link.attribs.href;
	var id_offre = href.split('/')[4].split('.')[0];
	if(href.indexOf('locations') !== -1 && !ids[id_offre]){
		var flat = {};
		request({uri: href, encoding: null}, function(err, resp, body){
			if(err){
				return cb(err, false);
			}else{
				flat.price = price;
				flat.href = href;
				flat.title = link.attribs.title;
				flat.labels = [];
				flat.values = [];

				var $ = cheerio.load(body);
				var crits = $('.criterias');
				flat.desc = $('.content').html();
				if(crits.html() !== null){
					var criteres = cheerio.load(crits.html());
					var labels = criteres('tr').find('th');
					var values = criteres('tr').find('td');
					labels.each(function(i, label){
						flat.labels.push(label.children[0].data);
					});
					values.each(function(i, val){
						flat.values.push(val.children[0].data);
					});
				}
				return cb(false, flat);
			}
		});
	}else{
		return cb(false, false);
	}
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
			var c = links.length;
			links.each(function(i, link){
				suck_this_flat(link, prix[i], function(err, flat){
					c--;
					if(!err && flat !== false){
						apparts.push(flat);
						if(!c){
							if(apparts.length > 0) send_mail(apparts);
							else console.log(new Date() + ' Rien de nouveau à envoyer.');
						}
					}else console.log(err + ' < is an errror');
				});
			});
		}else console.log('error requesting body page : ' + error);
	});
};

//	start srcapping.
scrap();
setInterval(function(){	scrap();}, conf.sec * 1000);
