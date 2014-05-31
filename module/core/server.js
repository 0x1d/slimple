var http = require("http");
var router = require("./router");
var Sessions = require("./sessions/sessions"),
    sessionHandler = new Sessions(null, { expires: 900 }); // memory store by default
/**
 * http deamon / web server
 */
exports.httpd = {
    /**
     * start the http server.
     * it passes the app context to the router
     */
    start: function(ctx) {
        
        // handle uncaught exceptions
        process.on('uncaughtException', function(error){
            ctx.log.error('Uncaught ' + error);
        });
        
        // create the HTTP server on the shared port
        var server = http.createServer(function(request, response) {
            try {
                sessionHandler.httpRequest(request, response, function(err, session) {
                    if (err) {
                        ctx.log.fatal(err);
                        return response.end("session error " + err);
                    }
                    session.refresh();
                    router.route(ctx, session, request, response);

                });
            } catch (error) {
                ctx.log.fatal(error);
                ctx.web.statusResponse.generalError("Problem handling request: "+error, response);
            }
        }).listen(ctx.config.port);
        ctx.log.info("Server started on port " + ctx.config.port);
        return server;
    }
};
