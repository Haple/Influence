'use strict';

var request = require('request-promise');
var cheerio = require('cheerio');

/**
 * The dafault constructor
 */
function Scraper(){

}

/**
 * Returns a http get request promise
 * 
 * @param {Object} req The request definition
 * @param {Promise} promise The get request promise
 */
Scraper.prototype.get = function (req) {
    return request(req);
}

/**
 * Returns a cheerio instance loaded with the given html body
 * 
 * @param {String} body The html body
 * @return {Function} $ The cheerio instance
 */
Scraper.prototype.load = function(body) {
    return cheerio.load(body);
}

/**
 * Returns a promise of a request call
 * 
 * @param  {String}  uri The request uri
 * @param  {Object}  qs  The request query string
 * @return {Promise} promise The request promise  
 */
Scraper.prototype.prepare = function(uri, qs) {
    var req = {
        uri:             uri,
        qs:              qs,
        simple:          false,
        transform:       this.load,
        followRedirects: false
    }

    return this.get(req).then(this.scrape);
}

/**
 * Executes the scrape chain:
 * request -> cheerio load -> scrape -> transform
 * 
 * @param {Array} promises The promises array
 * @return {Promise} promise The execution result
 */
Scraper.prototype.execute = function(promises) {
    var self = this;
    return Promise.all(promises).then(function(result){
        return self.transform(result);
    });
}

/**
 * The scrape method.
 * This is the abstract method that should be implemented by all the scrapers.
 * It performs a html body scrape.
 * 
 * @param {Function} $ The cheerio instance
 * @return {Array} result The scrape result
 */
Scraper.prototype.scrape = function($) {
    throw new TypeError('scrape() method must be implemented');
}

/**
 * The transform method.
 * This is the abstract method that should be implemented by all the scrapers.
 * It transform the scrape result in a array of objects.
 * 
 * @param {Array} result The scrape result 
 * @return {Array} normalized An array of normalized data
 */
Scraper.prototype.transform = function(result) {
    throw new TypeError('transform() method must be implemented');
}

module.exports = Scraper;