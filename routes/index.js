/*
 * GET home page
  */

'use strict'
var Book  = require('../lib/book');

exports.getIsbn = function(req, res) {
  var book = new Book;

  book.ensureIndexes();
//  var re = '9780521189064';
  console.log('Get to ' + req.params.num);
  book.getBookFromIsbn(req.params, function(err, data){
    res.send(data);
  });

}
            ///user/regist/:0999999/:9780521189064/
exports.getUser = function(req, res) {
  var book = new Book;

//  var re = '0999999';
  console.log('Get to ' + req.params.id);
  book.getBookForUser(req.params.id, function(err, data){
    if(err) {
      res.send(err)
    } else {
      res.send(data);
    }
  });

};

exports.registUser = function(req, res) {
  var book = new Book;

//  var re = '0999999';
  console.log('Get to ' + req.params.id + " and " + req.params.num);
  book.setBookForUser(req.params, function(err, data){
    if(err) {
      res.send(err)
    } else {
      res.send(data);
    }
  });


};