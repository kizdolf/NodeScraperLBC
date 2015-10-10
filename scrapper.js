'use strict';

var request = require('request'), //get body
nodemailer 	= require('nodemailer'), //send mail
conf		= require('./conf').conf, //that's you!
_			= require('lodash'),
more		= require('./doMore')
transporter = nodemailer.createTransport({
    service: 'Gmail', //you want something else? deal with it.
    auth: conf.gmail
});

exports.send_mail = function(apparts, from){
	more.doSomethingWithApparts(apparts);
	var plural = (apparts.length > 1) ? ' appartements' : ' appartement', //funk. or Useless?
	html = "<ul>";
	apparts.forEach(function(one){
		html += '<li><span style="line-height:24px; font-size:18px;">' + one.price + ' : <a href="' + one.href + '">' +  one.title + '</a>';
		if(one.upload !== false) html += '<small>  -- (' + one.upload + ')</small>';
		html += '</span><small><ul style="width:30%;">';
		one.labels.forEach(function(l, i){ html+= '<li>' + l + one.values[i] + '</li>'; });
		html += '</ul></small>';
		html += '<hr style="clear:both">';
		html += '</li><br>';
	});
	html += '</ul>';
	transporter.sendMail({
		encoding: 'unicode',
	    from: conf.gmail.user, //from you
	    to: conf.gmail.user, //to you
	    subject: '[' + from + '] ' + apparts.length + plural + ' à regarder!',
	    html: html
	}, function(error, info){
		if(error) console.log(error);
		else console.log('Message sent: ' + info.response + ' à ' + new Date());
	});
};

var scrap = function(){
	_.forEach(conf.urls, function(list, type){
		var scrapper = require('./scrappers/' + type); //get good scrapper.
		list.forEach(function(url){
			request({uri: url, encoding: null}, scrapper.scrap);
		});
	});
};

//	start srcapping.
scrap();
setInterval(function(){	scrap();}, conf.sec * 1000);
