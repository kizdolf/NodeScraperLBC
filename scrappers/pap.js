'use strict';
var main_scrapper 	= require('./../scrapper'),
db					= require('lowdb')('db.json'),
request 			= require('request'),
cheerio 			= require('cheerio'), //parse it like Jquery
iconv 				= require('iconv-lite');

var suck_this_flat = function(link, price, cb){
 	var href 	= link.attribs.href,
	id_offre 	= href.split('/')[4].split('.')[0];
	if(href.indexOf('locations') !== -1 && !db('pap').find({id: id_offre})){
		db('pap').push({id: id_offre});
		var flat = { price: price, href: href, title: link.attribs.title, labels: [], values: [] };
		request({uri: href, encoding: null}, function(err, resp, body){
			if(err) return cb(err, false);
			else{
				var $ = cheerio.load(body), criteres = cheerio.load($('.criterias').html()),
				labels = criteres('tr').find('th'), values = criteres('tr').find('td');
				flat.desc 	= $('.content').html();
				flat.upload = $('.upload_by').html().split('</a>')[1].split('-')[1];
				labels.each(function(i, label){ flat.labels.push(label.children[0].data); });
				values.each(function(i, value){ flat.values.push(value.children[0].data); });
				return cb(false, flat);
			}
		});
	}else return cb(false, false);
};

exports.scrap = function(err, resp, body){
	if(err) return false;
	body = iconv.decode(body, 'iso-8859-1');
	var apparts = [], prix = [], desc = [], helps = [],
	$			= cheerio.load(body),
	list 		= $('.header-annonce'),
	prices 		= list.find('.prix'),
	descs		= list.find('.desc'),
	props		= $('.description').find('ul');
	 
	prices.each(function(i, price){
		prix.push($(this).html());
	});
	descs.each(function(i, de){
		desc.push($(this).html());
	});
	props.each(function(i, prop){
		var labels = [], values = [];
		$(this).find('li').each(function(i, li){
			values.push($(this).html().split('</span>')[1].trim());
			labels.push($(this).find('span').html() + ': ');
		});
		helps.push({labels: labels, values: values});
	});
	list.each(function(i, offer){
		var refs  = offer.children[0].next.attribs,
		id = refs.name,
		href = refs.href,
		flat = {
			price: prix[i],
			id: id,
			href: 'http://www.pap.fr' + href, 
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