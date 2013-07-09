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
  console.log('Get to ' + req.params.id + " and " + req.params.num + " and " + req.params.date);
  book.setBookForUser(req.params, function(err, data){
    if(err) {
      res.send(err)
    } else {
      res.send(data);
    }
  });
};

exports.updateUser = function(req, res) {
  var book = new Book;

//  var re = '0999999';
  console.log('Get to ' + req.params.id + " and " + req.params.num + " and " + req.params.date);
  book.updateBookForUser(req.params, function(err, data){
    if(err) {
      res.send(err)
    } else {
      res.send(data);
    }
  });
};

exports.resetUser = function(req, res) {
  var book = new Book;

//  var re = '0999999';
  console.log('Get to ' + req.params.id );
  book.resetBookForUser(req.params.id, function(err, data){
    if(err) {
      res.send(err)
    } else {
      res.send(data);
    }
  });
};

exports.setProgress = function(req, res) {
  var book = new Book;

//  var re = '0999999';
  console.log('Get to ' + req.params.id + req.param.page);
  book.setProgress(req.params, function(err, data){
    if(err) {
      res.send(err)
    } else {
      res.send(data);
    }
  });
};