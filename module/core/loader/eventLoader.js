var walker = require("../../util/file/treeWalker");

exports.bindEvents = bindEvents;

/**
 * Load all modules in a given path recursively.
 */
function bindEvents(ctx) {
    var path = process.cwd()+ctx.config.eventLocation;
    walker.exec(path,function(file){
        var event = require(file);
        ctx.log.info('bind event: ' + event.name);
        ctx.event.addListener(event.name, function(data){ 
            event.invoke(ctx, data); 
        }); 
    });
}