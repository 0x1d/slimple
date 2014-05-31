var walker = require("../../util/file/treeWalker");
var schemaHolder = [];

exports.loadSchemas = loadSchema;
exports.schemaHolder = schemaHolder;

/**
 * Load all schemas in a given path recursively.
 */
function loadSchema(ctx) {
    var path = process.cwd()+ctx.config.schemaLocation;
    walker.exec(path, function(file){
        var descriptor = require(file);
        var schemaName = descriptor.name;
        ctx.log.info('bind schema: ' + schemaName);
        schemaHolder[schemaName] = descriptor; 
    });
    return schemaHolder;
}


