'use strict';
var main_scrapper 	= require('./../scrapper'),
db					= require('lowdb')('db.json'),
request 			= require('request'),
cheerio 			= require('cheerio'), //parse it like Jquery
iconv 				= require('iconv-lite');



var suck_this_flat = function(link, price, cb){
 	var href 	= link.attribs.href,
	id_offre 	= href.split('/')[4].split('.')[0];
	if(href.indexOf('locations') !== -1 && !db('lbc').find({id: id_offre})){
		db('lbc').push({id: id_offre});
		var flat = { price: price, href: href, title: link.attribs.title, labels: [], values: [] };
		request({uri: href, encoding: null}, function(err, resp, body){
			if(err) return cb(err, false);
			else{
				var $ = cheerio.load(body), criteres = cheerio.load($('.criterias').html()),
				labels = criteres('tr').find('th'), values = criteres('tr').find('td');
				
				flat.desc 	= $('.content').html();
				flat.zipcode = $('[itemprop="postalCode"]').html();
				flat.upload = $('.upload_by').html().split('</a>')[1].split('-')[1];
				labels.each(function(i, label){ flat.labels.push($(this).html()); });
				values.each(function(i, value){ flat.values.push($(this).html()); });
				return cb(false, flat);
			}
		});
	}else return cb(false, false);
};

exports.scrap = function(err, resp, body){
	if(err) return false;
	body = iconv.decode(body, 'iso-8859-15');
	var apparts = [], prix = [],
	list 		= cheerio.load(body)('.list-lbc'),
	links 		= list.find('a'), //get links
	prices 		= list.find('.price'), //get prices
	count 		= links.length;
	prices.each(function(i, price){ prix.push(price.children[0].data.trim()); });
	links.each(function(i, link){
		suck_this_flat(link, prix[i], function(err, flat){
			count--;
			if(!err && flat !== false) apparts.push(flat) && count || apparts.length > 0 && main_scrapper.send_mail(apparts, 'lbc'); //jshint ignore:line
		});
	});
};