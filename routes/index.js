/*
 * GET home page
  */

'use strict'
var Isbn  = require('../lib/isbn');

exports.getIsbn = function(req, res) {
  var isbn = new Isbn;
//  var re = '9780521189064';
  console.log('Get to ' + req.params.num );
  isbn.getBookForUser(req.params.num, function(err, data){
res.send(data);
  });

}