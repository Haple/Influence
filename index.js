var Google    = require('./lib/google');
var Hunter    = require('./lib/hunter');
var Instagram = require('./lib/instagram');

/**
 * The default constructor
 */
function Influence(){

}

/**
 * Searches instagram profiles based on the given term
 * 
 * @param  {String}  term  The term to search
 * @param  {Number}  limit The google's search limit
 * @return {Promise} promise A promise to be executed
 */
Influence.find = function(term, limit) {
    var google = new Google();

    return google.search(term, limit)
        .then(function(links){
            var hunter = new Hunter();
            return hunter.hunt(links);
        })
        .then(function(profiles){
            var instagram = new Instagram();
            return instagram.profiles(profiles);
        });
}

module.exports =  {
    Google:    Google,
    Hunter:    Hunter,
    Instagram: Instagram,
    Influence: Influence
};