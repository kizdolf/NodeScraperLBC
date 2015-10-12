'use strict';
var
db					  = require('lowdb')('./dbs/seLoger.json'),
request 			= require('request'),
cheerio 			= require('cheerio'), //parse it like Jquery
iconv 				= require('iconv-lite');

var suck_it = function(url, cb){
  request({uri: url, encoding: null}, function(err, resp, body){
    if(err) return cb([], []);
    var values = [];
    var labels = [];
    body = iconv.decode(body, 'utf8');
    var $ = cheerio.load(body);
    var props = $('.description-liste').find('li');
    props.each(function(){
      labels.push(' ');
      values.push($(this).html());
    });
    return cb(labels, values);
  });
};

exports.scrap = function(url){
  return new Promise(function(resolve, reject){
    var apparts = [];
    request({uri: url, encoding: null}, function(err, resp, body){
      if(err)
        reject(err);
      body = iconv.decode(body, 'utf8');
      var $ = cheerio.load(body);
      var list = $('.liste_resultat').find('article');
      var count = list.length;
      list.each(function(){
        var infos = $(this).find('.listing_infos');
        var flat = {from: 'seLoger', labels:[], values:[], upload: false};
        flat.id = parseInt($(this).attr('data-listing-id'));
        flat.href = $($(infos).find('a')).attr('href');
        flat.price = $($(infos).find('.amount')).html();
        flat.title = $($(infos).find('a')).attr('title');
          suck_it(flat.href, function(labels, values){
            count--;
            if(!db('seLoger').find({id: flat.id})){
              db('seLoger').push({id: flat.id});
              flat.labels = labels;
              flat.values = values;
              apparts.push(flat);
            }
            if(count === 0){
              resolve(apparts);
            }
          });
      });
    });
  });
};
