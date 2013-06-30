var assert = require('assert');

var lib = process.env.COVERAGE_MODULE_STUDY ? '../lib-cov/' : '../lib/';

describe('study.book',function(){
  var Book  = require(lib + 'book');
  describe('isbn',function(){
    it('should return data from a ISBN code',function(done){
      var book = new Book;

      var obj = {num: '9780521189064', id: '0999999'};

      book.getBookFromIsbn(obj, function(err, data){
        assert.strictEqual(data[0].title,'English Grammar in Use with Answers');
        assert.strictEqual(data[0].pages, 390);

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

    it('should return 203 from a ISBN code',function(done){
      var book = new Book;


      var obj = {
        userId: '0999999',
        bookInfo: [{
          bookKey: 9780521189064,
          numberOfPages: 390,
          targetEndDate: new Date(),
          bookStartDate: new Date(),
          bookStatus: true,
          progress : {
            startPage: 23
          }
        }]};
      book.setBookForUser(obj, function(err, data){
       // assert.strictEqual(err,203);
        book.getBookForUser('0999999', function(err, res) {
          assert.ok(!err);
          assert.strictEqual(res.bookInfo[0].bookKey, 9780521189064);
        });
        assert.ok(data);

        done();
      });
    });

    it('should return 203 from a ISBN code',function(done){
      var book = new Book;


      var obj = {
        userId: '0999999',
        bookInfo: {
          bookKey: 9780521189064,
          bookStatus: false
        }};
      book.resetBookForUser(obj, function(err, data){
        // assert.strictEqual(err,203);
        assert.ok(data);

        done();
      });
    });

    it('should return 203 from a ISBN code',function(done){
      var book = new Book;

      var userId = '0999999';
      book.getBookForUser(userId, function(err, data){
        // assert.strictEqual(err,203);
        assert.ok(!data);

        done();
      });
    });

  });

});
