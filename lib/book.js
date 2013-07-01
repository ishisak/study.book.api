'use strict';

var BookApi = require('../config.js');
var https = require('https');
var mongoUri = process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL ||
               'mongodb://127.0.0.1:27017/test';
function Book() {

}

/**
 * Sends HTTP request to weather provider using this.host and this.buildPath
 * Response is processed by this.responseCallback and returned to the provided callback
 * @param  {Function} callback [description]
 */
Book.prototype.getBookFromIsbn = function (obj, callback) {
    var self = this;
                          //{ "userId": userId, "bookInfo" : { $elemMatch : {"bookStatus":true}}}
  self.findMongo('books', {'books': { $elemMatch : { bookKey: obj.num}}}, function(err, result) {
    if(result) {
      callback(err, result);
      return;

    } else {
      var options = new BookApi();
      options.path = options.path + obj.num;

      https.request(options, function(response){
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
          str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {

          var res = JSON.parse(str);

          self.normalizeRes(obj.num, res, callback);
        });

        response.on('error', function() {
          callback(203, null);
        });
      }).end();

    }
  });


};

Book.prototype.normalizeRes = function (bookKey, res, callback) {
   if (res.items && res.items.length > 0) {
       var resBooks = [];
       var books = res.items;
       books.forEach(function (data) {

           var book = {
               title: data.volumeInfo.title,
               pages: data.volumeInfo.pageCount,
               bookKey: bookKey
           };

           resBooks.push(book);
        });
     var obj = {books: resBooks, ts: new Date()};
     this.insertMongo('books', obj, function(err, result) {
       callback(null, resBooks);
     });
    } else {
        callback(203, null);
    }


};


Book.prototype.getBookForUser =  function (userId, callback) {

  var self = this;

  self.findMongo('test_insert', {"userId":userId, "bookInfo.bookStatus":true}, function(err, result) {
//    self.findMongo('test_insert',{"userId":userId, {"bookInfo" : { $elemMatch : { {"bookStatus":true}}}, function(err, result) {
    if(!result || err) {
      callback({errCode:"404", errMsg: "not Found User"}, null);
    } else {
      self.calcProgress(result, callback);

    }

  });

};

Book.prototype.setBookForUser =  function (obj, callback) {

  var self = this;
  self.resetBookForUser(obj.id, function(err, res01){
    if(err) callback({errCode:204, errMsg: "rest error"});

    // get cached book information
    self.findMongo('books',  {'books': { $elemMatch : { bookKey: obj.num}}}, function(err, book) {
      if(book) {
        var bookInfo = book.books[0];
        bookInfo.bookStatus = true;
        var setting = {'targetEndDate':new Date(obj.date), 'currentPage' : 1};
        var data = {'userId':obj.id, 'bookInfo':bookInfo, 'setting': setting};
        self.insertMongo('test_insert', data, function(err, result) {

          callback(err, result);

        });

      } else {
        callback({errCode:"402", errMsg: "regist Book Error"}, null);

      }
    });
  });

};


Book.prototype.setProgress =  function (obj, callback) {

  var mongo = require('mongodb');

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('test_insert', function(er, collection) {
      //collection.update({"userId":obj.userId, "bookInfo.bookKey":obj.bookInfo.bookKey}, {$set: {"bookInfo.$.bookStatus":false}}, function(er,rs) {
      collection.update({"userId":obj.id, "bookInfo.bookStatus":true}, {$set: {"setting.currentPage":obj.page}}, {w:1}, function(er,rs) {

        callback(err,rs);
      });
    });
  });
};

Book.prototype.resetBookForUser =  function (userId, callback) {

  var mongo = require('mongodb');

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('test_insert', function(er, collection) {
      //collection.update({"userId":obj.userId, "bookInfo.bookKey":obj.bookInfo.bookKey}, {$set: {"bookInfo.$.bookStatus":false}}, function(er,rs) {
      collection.update({"userId":userId}, {$set: {"bookInfo.bookStatus":false}}, {w:1, multi:true}, function(er,rs) {

      callback(err,rs);
      });
    });
  });

};

Book.prototype.insertMongo = function (coll, obj, callback) {
  var mongo = require('mongodb');
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection(coll, function(er, collection) {

      collection.insert(obj, function(er,rs) {
        callback(er, rs) ;

      });
    });
  });

};

Book.prototype.findMongo = function (coll, obj, callback) {
  //var MongoClient = require('mongodb').MongoClient;
  var mongo = require('mongodb');

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection(coll, function(er, collection) {
      collection.findOne(obj, function(er, rs) {
        callback(err, rs);
      });
    });
  });

};

/*
 *  ensureIndexes
 *
 *  @Description
 *    This method goes through a list of collection objects with expiry times and calls
 *    ensureIndexes on a mongo database to set a TTL index used in mongo 2.2 or higher to expire
 *    objects out at a specific length of time after creation
 *    It is intended to be called once at application launch
 *
 *    @params
 *      None
 *
 */
Book.prototype.ensureIndexes = function () {
  var mongo = require('mongodb');

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('books', function(er, collection) {
      collection.ensureIndex( { "ts": 1}, {expireAfterSeconds: 600}, function(er,rs) {
        return;
      });
    });
  });
};

Book.prototype.calcProgress = function (obj, callback) {

  try {
    // days progress
    var today = new Date();
    var remain = obj.setting.targetEndDate.getTime() - today.getTime();
    obj.setting.remainDays = Math.floor(remain / (1000*60*60*24));

    // pages progress
    obj.setting.remainPages = obj.bookInfo.pages - obj.setting.currentPage;

    // recommend pages
    obj.setting.recommend = Math.round(obj.setting.remainPages / obj.setting.remainDays);

    callback(null, obj);

  } catch (e) {
    callback({'errCode': 401, 'errMsg': 'can not get your data'}, null);
  }

};

module.exports = Book;