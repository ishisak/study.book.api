'use strict';

var config = require('../config.js');
var http = require('http');

function Isbn() {

}

/**
 * Sends HTTP request to weather provider using this.host and this.buildPath
 * Response is processed by this.responseCallback and returned to the provided callback
 * @param  {Function} callback [description]
 */
Isbn.prototype.getBookForUser = function (number, callback) {
    var self = this;
    var options = config.isbn;
    options.path = options.path + number;

    http.request(options, function(response){
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            self.normarizeRes(str, callback);
        });

        response.on('error', function() {
            callback(203, null);
        });
    }).end();
};

Isbn.prototype.normarizeRes = function  (str, callback) {
    var res = jsonp2json(str);

   if (res.data && res.data.length > 0) {
       var resBooks = [];
       var books = res.data;
       books.forEach(function (data) {

           //For getting number of pages
           var numArray = data.physical_description_text.match(/[0-9]+/g);

           var book = {
               title: data.title,
               pages: numArray[numArray.length-1]
           };

           resBooks.push(book);
        });
        callback(null, resBooks);
    } else {
        callback(203, null);
    }


}

/**
 * Takes a string representing a JSONP response, and returns an object representing the contained JSON
 * @param {string} jsonp
 * @returns {object}
 */
function jsonp2json(jsonp){
    return JSON.parse(jsonp);
}
module.exports = Isbn;