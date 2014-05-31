var cluster = require("cluster");
var http = require("http");
var router = require("./router");
var Sessions = require("sessions"),
    sessionHandler = new Sessions(); // memory store by default
/**
 * http deamon / web server
 */
exports.httpdCluster = {
    /**
     * start the http server.
     * it passes the app context to the router
     */
    start: function(ctx) {
        if (cluster.isMaster) {
            
            // spawn a child process / workers for each CPU core
            require('os').cpus().forEach(function(){
                cluster.fork();
            });
            
            // event when worked is connected
            cluster.on('listening', function(worker, address) {
                ctx.log.info("Worker #"+worker.id+" is now connected to "+address.address +":" + address.port);
            });

            // event when worked dies
            cluster.on("exit", function(worker, code, signal) {
                var exitCode = worker.process.exitCode;
                ctx.log.info('Worker ' + worker.process.pid + ' died ('+exitCode+'). restarting...');
                cluster.fork();
            });
        } else {
            // create the HTTP server on the shared port
            http.createServer(function(request, response) {
                try {
                    sessionHandler.httpRequest(request, response, function(err, session) {
                        if (err) {
                            ctx.log.fatal(err);
                            return response.end("session error " + err);
                        }
                        session.refresh();
                        ctx.session = session;
                        router.route(ctx, request, response);
    
                    });
                }
                catch (error) {
                    ctx.log.fatal(error);
                }
            }).listen(ctx.config.port);
            ctx.log.info("Server started on port " + ctx.config.port);
        }

    }
};