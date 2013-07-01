var assert = require('assert');

var lib = process.env.COVERAGE_MODULE_STUDY ? '../lib-cov/' : '../lib/';

describe('study.book',function(){
  var Book  = require(lib + 'book');
  describe('isbn',function(){
    it('should return data from a ISBN code',function(done){
      var book = new Book;

      var obj = {num: '9780521189064', id: '0999999'};

      book.getBookFromIsbn(obj, function(err, data){
        assert.strictEqual(data.books[0].title,'English Grammar in Use with Answers');
        assert.strictEqual(data.books[0].pages, 390);

        done();
      });
    });

    it('should return 203 from a ISBN code',function(done){
      var book = new Book;

      var obj = {num: null, id: '0999999'};

      book.getBookFromIsbn(obj, function(err, data){
        assert.strictEqual(err, 203);
        assert.ok(!data);

        done();
      });
    });

    it('should return registed data after set user info',function(done){
      var book = new Book;

      var obj = {'id':'0999999', 'num': '9780521189064', 'date':'2013,07,31'}
      book.setBookForUser(obj, function(err, data){
       // assert.strictEqual(err,203);
        book.getBookForUser('0999999', function(err, res) {
          assert.ok(!err);
          assert.strictEqual(res.bookInfo.bookKey, '9780521189064');
        });
        assert.ok(data);

        done();
      });
    });

    it('should return 203 from a ISBN code',function(done){
      var book = new Book;

      var obj = {page: '234', id: '0999999'};

      book.setProgress(obj, function(err, data){
        assert.ok(!err);
        book.getBookForUser('0999999', function(err, res) {
          assert.ok(!err);
          assert.strictEqual(res.setting.currentPage, '234');
          done();

        });

      });
    });

    it('should reset all user info',function(done){
      var book = new Book;

      var userId = '0999999';

      book.resetBookForUser(userId, function(err, data){
        assert.ok(!err);
        book.getBookForUser('0999999', function(err, res) {
          assert.ok(!res);
          assert.strictEqual(err.errCode, "404");


          done();

        });

      });
    });

  });

});
