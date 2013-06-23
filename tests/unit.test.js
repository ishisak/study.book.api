var assert = require('assert');

var lib = process.env.COVERAGE_MODULE_STUDY ? '../lib-cov/' : '../lib/';

describe('study.book',function(){
    var Isbn  = require(lib + 'isbn');
    describe('isbn',function(){
        it('should return data from a ISBN code',function(done){
            var isbn = new Isbn;

            number = '9780521189064';

            isbn.getBookForUser(number, function(err, data){
                assert.strictEqual(data[0].title,'English Grammar in Use with Answers');
                assert.strictEqual(data[0].pages, 390);

                done();
            });
        });
        it('should return 203 from a ISBN code',function(done){
            var isbn = new Isbn;

            number = null;

            isbn.getBookForUser(number, function(err, data){
                assert.strictEqual(err,203);
                assert.ok(!data);

                done();
            });
        });
    });

});
