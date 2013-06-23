'use strict';


/**
 * This is the config for the study book
 *
 */

/**
 * Constructor for the search configuration object
 *
 * @class fc.modules.search.config
 * @public
 */

module.exports = {
    'isbn': {
        host:'www.googleapis.com',
        path:'/books/v1/volumes?q='
    }

}