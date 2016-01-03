'use strict';

var
nodemailer 	= require('nodemailer'), //send mail
conf	    	= require('./conf').conf, //that's you!
db		    	= require('lowdb')('./dbs/stats.json'),
transporter = nodemailer.createTransport({
    service: 'Gmail', //you want something else? deal with it.
    auth: conf.gmail
});

global.flats = [];

exports.send_mail = function(apparts, to){
	var plural = (apparts.length > 1) ? ' appartements' : ' appartement', //funk. or Useless?
	html = "<ul>";
	apparts.forEach(function(one){
		html += '<li>(' + one.from + ') : <span style="line-height:24px; font-size:18px;">' + one.price + ' : <a href="' + one.href + '">' +  one.title + '</a>';
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
	    from: conf.gmail.user,
	    to: to.join(','),
	    subject:  apparts.length + plural + ' à regarder!',
	    html: html
	}, function(error, info){
		if(error) console.log(error);
		else console.log('Message sent: ' + info.response + ' à ' + new Date());
	});
};


var main = function(){
	var scrappers = conf.scrappers;
	var flats = [];
	var mailer = true;
	var queue = [];

	var scrapWebSite = function (website, rank, cb){
		if(!website.urls[rank]){
			return cb(true);
		}
		var url = website.urls[rank];
		var handler = require('./scrappers/' + website.name);
		handler.scrap(url)
		.then(function(apparts){
			flats = flats.concat(apparts);
			return scrapWebSite(website, rank + 1, cb);
		}).catch(function(err){
			console.log('error!');
			console.log(err);
		});
	};

	var scrapOne = function (scrapper, rank, cb){
		if(!scrapper.websites[rank]){
			return cb(true);
		}else{
			scrapWebSite(scrapper.websites[rank], 0, function(done){
        if(done)
				    return scrapOne(scrapper, rank + 1, cb);
        else
            return cb(false);
			});
		}
	};

	var scrapOneByOne = function(scrappers, rank, cb){
		if(!scrappers[rank]){
			return cb(true);
		}else{
            var mails = scrappers[rank].mailTo;
			scrapOne(scrappers[rank], 0, function(done){
                if(done){
      				queue.forEach(function(callback){
      					callback(flats);
      				});
      				if(mailer){
      					if(flats.length > 0)
      						exports.send_mail(flats, mails);
      				}
      				return scrapOneByOne(scrappers, rank + 1, cb);
                }else
                    return cb(false);
			});
		}
	};
	return {
		launch : function (){
			flats = [];
			var $ = this;
			scrapOneByOne(scrappers, 0, function (done){
        if(!done)
            console.log('erreur scrapping. that\'s all I know...');
				setTimeout(function() {
          $.launch();
        }, conf.sec * 1000);
			});
		},
		set_mail : function(bool){
			mailer = bool;
		},
		use : function(callback){
			queue.push(callback);
		}
	};
};

//invoke
var scrapping = new main();

//set mail if you want (default to true)
// scrapping.set_mail(false);

//add function triggered before send_mail.
//so it's trigger once by scrapper.
//also it's non-blocking. (meaning you don't need to return anything)
scrapping.use(function(flats){
	var obj = {
		date: new Date(),
		nbr: flats.length
	};
	db('stats').push(obj);
  console.log('new flats: ' + flats.length);
});

scrapping.launch();
