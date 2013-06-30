'use strict';


/**
 * This is the config for the study book
 *
 */

/**
 * Constructor for the book configuration object
 *
 * @class study.book.config
 * @public
 */

function BookApi () {
  this.host = 'www.googleapis.com';
  this.path = '/books/v1/volumes?q=isbn:';
}
module.exports = BookApi;
/*
{
    'isbn': {
        host:'www.googleapis.com',
        path:'/books/v1/volumes?q=isbn:'
    };

}*/
