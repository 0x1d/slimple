var log = require('./logger.js');

/**
 * append event listener for console
 */
log.emitter.on('append', function(msg){
    console.log(msg);
});
