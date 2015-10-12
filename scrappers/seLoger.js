'use strict';
var
db					  = require('lowdb')('./dbs/seLoger.json'),
request 			= require('request'),
cheerio 			= require('cheerio'), //parse it like Jquery
iconv 				= require('iconv-lite');

exports.scrap = function(url){
  return new Promise(function(resolve, reject){
    var apparts = [];
    request({uri: url, encoding: null}, function(err, resp, body){
      if(err)
        reject(err);
      body = iconv.decode(body, 'utf8');
      var $ = cheerio.load(body);
      var list = $('.liste_resultat').find('article');
      list.each(function(){
        var infos = $(this).find('.listing_infos');
        var props = $(this).find('.property_list');

        var flat = {from: 'seLoger', labels:[], values:[], upload: false};
        flat.id = parseInt($(this).attr('data-listing-id'));
        flat.href = $($(infos).find('a')).attr('href');
        flat.price = $($(infos).find('.amount')).html();
        flat.title = $($(infos).find('a')).attr('title');
        $(props).find('li').each(function(){
          flat.labels.push(' ');
          flat.values.push($(this).html());
        });
        if(!db('seLoger').find({id: flat.id})){
          db('seLoger').push({id: flat.id});
          apparts.push(flat);
        }
      });
      resolve(apparts);
    });
  });
};
