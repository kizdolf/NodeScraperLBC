'use strict';
var main_scrapper 	= require('./../scrapper'),
db					= require('lowdb')('db.json'),
request 			= require('request'),
cheerio 			= require('cheerio'), //parse it like Jquery
iconv 				= require('iconv-lite'); //because shitty encoding.

exports.scrap = function(err, resp, body){
	if(err) return false;
	body = iconv.decode(body, 'iso-8859-1');
	var apparts = [], prix = [], desc = [], helps = [],
	$			= cheerio.load(body),
	list 		= $('.header-annonce');

	list.find('.prix').each(function(i, price){ prix.push($(this).html()); });
	list.find('.desc').each(function(i, descr){ desc.push($(this).html()); });
	$('.description').find('ul').each(function(i, prop){
		var labels = [], values = [];
		$(this).find('li').each(function(i, li){
			values.push($(this).html().split('</span>')[1].trim());
			labels.push($(this).find('span').html() + ': ');
		});
		helps.push({labels: labels, values: values});
	});
	list.each(function(i, offer){
		var refs  = offer.children[0].next.attribs,
		flat = {
			price: prix[i],
			id: refs.name,
			href: 'http://www.pap.fr' + refs.href, 
			title: desc[i],
			upload: false,
			labels: helps[i].labels,
			values: helps[i].values
		};
		if(!db('pap').find({id: flat.id})) {
			db('pap').push({id: flat.id});
			apparts.push(flat);
		}
	});
	if(apparts.length > 0) main_scrapper.send_mail(apparts, 'pap');
};