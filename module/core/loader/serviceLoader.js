var walker = require("../../util/file/treeWalker");
var serviceHolder = {};

exports.loadServices = loadServices;
exports.serviceHolder = serviceHolder;

/**
 * Load all modules in a given path recursively.
 */
function loadServices(ctx) {
    
    var path =  process.cwd() + ctx.config.serviceLocation;
    
    var parents = [];
    walker.exec(path, function(file, parent){
        
        parent = parent.replace(path,'');
        
        var service = require(file);
        var resource;
        var bound = false;
        
        parents.forEach(function(entry){
            if(parent.indexOf(entry.path) > -1){
                var serviceResource = service.resource || '';
                resource = entry.resource + '/' + parent.replace(entry.path, '')  + serviceResource;
                bindService(resource, service, parent);
                bound = true;
            }
        });
        
        if(!bound){
            bindService(resource, service, parent);
            bound = true;
        }

       
    });
    
    function bindService(resource, service, parent){
        var serviceResource = service.resource || '';
        resource = resource || parent +  serviceResource;
        // FUCKING WINDOWS!!! (TODO: Find better way to deal with windows paths)
        resource = resource.replace(process.cwd() + "\\services", "").replace(/\\/g, "/");
        serviceHolder[resource] = service;
        map(resource);
        parents.push({ path: parent+'/', resource: resource });
        ctx.log.info('bind service: ' + resource);
    }
    
    function map(resource){
        ctx.way.map(resource, { 
            invoke: function(resource){
                return function(context, requestData, session, request, response) {
                    
                    response.setHeader('Content-Type', 'text/html');
                    
                    try {
                        context.services[resource][request.method](ctx, {
                            data: requestData,
                            request: request,
                            response: response,
                            session: session,
                            reply: function(data) { context.web.responseHandler.reply(response, 200, data) }
                        });
                    } catch(error){
                        var statusCode = error.status ? error.status : 500;
                        context.web.responseHandler.reply(response, statusCode, error);
                    }
                    
                    
                };
            }(resource)
        });
    }

}

