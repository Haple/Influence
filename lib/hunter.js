'use strict';

var util    = require('util');
var Scraper = require('./scraper');

/**
 * The default constructor
 */
function Hunter() {
    Scraper.call(this);
}

/**
 * The implementation of the abstract method transform()
 * Returns a single array of the given multi array
 * 
 * @param  {Array} result The multi array
 * @return {Array} single The single array
 */
Hunter.prototype.transform = function (result) {
    var profiles = [].concat.apply([], result);
    return Array.from(new Set(profiles));
}

/**
 * The implementation of the abstract method scrape()
 * It searches for instagram profiles in the given html body.
 * 
 * @param  {Function} $     The cheerio instance
 * @return {Array}    links The Instagram account links
 */
Hunter.prototype.scrape = function($) {
    var profiles = [];
    var links = $('a[href^="http://instagram.com/"],a[href^="https://instagram.com/"]')
                    .not('a[href^="http://instagram.com/p/"]')
                    .not('a[href^="https://instagram.com/p/"]')
                    .not('a[href^="http://instagram.com/d/"]')
                    .not('a[href^="https://instagram.com/d/"]');

    $(links).each(function(i, link) {
        var href = $(link).attr('href');
        if (href.endsWith('/')) {
            href = href.substring(0, href.length - 1);
        }

        profiles.push(href);
    });

    return profiles;
}

/**
 * Searches for instagram profiles links in the given page's url
 * 
 * @param  {Array} links The page's url
 * @return {Promise} promise A promise of the execution chain
 */
Hunter.prototype.hunt =  function(links) {
    var promises = [];

    for (var index in links) {
        var link = links[index];
        var promise = this.prepare(link);
        promises.push(promise);
    }

    return this.execute(promises);
}

util.inherits(Hunter, Scraper);
module.exports = Hunter;