var fs = require('fs');
var servicePath = require('path');

exports.exec = exec;

/**
 * walk the tree and exec callback as soon as it reaches a file.
 */
function exec(path, callback, parentDir){
    
    fs.lstat(path, function(err, stat) {
        if (stat.isDirectory()) {
            // read directories recursivly
            fs.readdir(path, function(err, files) {
                var f, l = files.length;
                for ( var i = 0; i < l; i++) {
                    f = servicePath.join(path, files[i]);
                    exec(f, callback, path);
                }
            });
        } else {
            if(path.indexOf('/.') < 0 && path.indexOf('\\.') < 0){ // ignore hidden files
                callback(path, parentDir || '');
            }
        }
    });        
}

