'use strict';

var util    = require('util');
var _       = require('lodash');
var Scraper = require('./scraper');

/**
 * The default constructor
 */
function Instagram() {
    Scraper.call(this);
}

/**
 * The implementation of the abstract method transform()
 * Returns a single array of the given multi array
 * 
 * @param  {Array} result The multi array
 * @return {Array} single The single array
 */
Instagram.prototype.transform = function(result) {
    var profiles = [].concat.apply([], result);
    return _.compact(profiles);
}

/**
 * The implementation of the abstract method scrape()
 * It performs a scrape of the user's Instagram account page.
 * 
 * @param  {Function} $ The cheerio instance
 * @return {Array}    profiles The instagram account profiles
 */
Instagram.prototype.scrape = function($) {
    var link        = $('link[hreflang="x-default"]').attr('href');
    var picture     = $('meta[property="og:image"]').attr('content');
    var description = $('meta[property="og:description"]').attr('content');

    // profile not found
    if (!link || !picture || !description)
        return;

    if (link.endsWith('/'))
        link = link.substring(0, link.length - 1);

    var splited     = link.split('/');
    var username    = splited[splited.length -1];
    var indexOf     = description.indexOf('-');
    var info        = description.substring(0, indexOf - 1).trim();
    var followers   = info.split(',')[0].replace(' Followers', '');
    var title       = $('title').text();
    var index       = title.indexOf('(');
    var name        = title.substring(0, index - 1).trim();

    return {
        link     : link,
        username : username,
        name     : name,
        followers: followers,
        picture  : picture
    }
}

/**
 * Extracts information of the given instagram links
 * 
 * @param  {Array}   links The instagram links
 * @return {Promise} promise A promise of the execution chain
 */
Instagram.prototype.profiles = function(links) {
    var promises = [];

    for (var index in links) {
        var link = links[index];
        var promise = this.prepare(link);
        promises.push(promise);
    }

    return this.execute(promises);
}

util.inherits(Instagram, Scraper);
module.exports = Instagram;