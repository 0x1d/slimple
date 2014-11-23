var fs = require('fs');
var log = require('./logger.js');

/**
 * append event listener for file
 */
log.emitter.on('append', function(msg){
    fs.appendFile(process.cwd()+"/log/server.log", msg+"\n", function(err) {
        if(err) {
            console.log(err);
        }
    }); 
});
