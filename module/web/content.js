var fs = require('fs');
var mime = require('mime');
//var zlib = require('zlib');
var state = require('./statusResponse');

module.exports ={

    serve : function(resource, response){
        fs.readFile('./'+resource, function(error, content) {
            if (!error) {
                var type = mime.lookup('./'+resource);
                response.writeHead(200, { 'Content-Type': type });
                response.write(content,'binary');
                response.end();
            } else {
                state.notFound(error, response);
            }
        });
    },
    
    stream: function(resource, response){
        var type = mime.lookup('./'+resource);
        response.writeHead(200, { 'Content-Type': type });
        fs.createReadStream('./'+resource)
        //.pipe(zlib.createGzip()) { 'content-encoding': 'gzip' }
        .pipe(response);
    }

}; 
