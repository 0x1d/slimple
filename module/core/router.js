var url = require("url");
var objUtil = require("../util/obj");
var statusResponse = require('../web/statusResponse');
/**
 * routes incoming requests to the corresponding service. if no
 * service is defined, the router try's to serve content directly.
 */
exports.route = function(ctx, session, request, response) {

    try{
        var pathname = url.parse(request.url).pathname;
        
        // match a path to a service route / resource
        ctx.log.trace(request.method + ' '+pathname);
        var match = ctx.way.match(pathname);
        if(match){ // service found, process request
            ctx.web.requestHandler.rest(request, response, function(data) {
                var serviceData = objUtil.extend(data, match.params);
                match.actions[0].invoke(ctx, serviceData, session, request, response );
            });
        } else { // service not found, serve content
            if (pathname === '/') { // no page requested, try to show index.html
                ctx.web.content.stream(ctx.config.contentLocation + "/index.html", response);
            } else {
                ctx.web.content.stream(ctx.config.contentLocation + "/" + pathname, response);
            }
        }
    } catch(error) {
        ctx.log.error(error);
        statusResponse.generalError("Routing problem: "+error, response);
    }

};