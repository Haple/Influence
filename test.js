'use strict';

var Influence = require('./').Influence;


var term = 'top fitness instagram accounts';
Influence.find(term).then(

    /**
     * Handles the instagram profiles
     */
    function(profiles) {
        console.log(profiles);
    }

).catch(

    /**
     * Handles the error
     */
    function(error) {
        console.error(error);
    }
    
);