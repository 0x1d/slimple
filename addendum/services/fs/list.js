var fs = require('fs');

module.exports = {
	
    resource: '/*',

    GET: function(ctx, http){
        this.listFolder(ctx, http);
    },

	POST: function(ctx, http){
        this.listFolder(ctx, http);
	},

    listFolder: function(ctx, http){
        try {
            var fromPath = '/' + http.data.splat[0];
            ctx.log.trace('listFolder: requested ' + fromPath);
            if (fromPath.indexOf('/') === 0) {
                var fromPath = process.cwd() + fromPath;
                ctx.log.trace("read path " + fromPath);
                fs.stat(fromPath, function(err, stats) {
                    if (stats !== null && stats !== undefined) {
                        if (stats.isDirectory()) {
                            fs.readdir(fromPath, function(err, files) {
                                var fullPath = fromPath;
                                fromPath = fromPath.replace(process.cwd()+'/', '');
                                var filesList = files.map(function(fileName){
                                    var item = fullPath + '/' + fileName;
                                    var stat = fs.statSync(item);
                                    var href = '/'+fromPath+'/'+fileName;
                                    var info = {
                                        text: fileName,
                                        isFolder: stat.isDirectory(),
                                        href: href
                                    };
                                    return info;
                                });
                                http.reply(filesList);
                            });
                        } else {
                            http.reply({
                                isFile: true
                            });
                        }
                    }
                });
            }
        } catch (error) {
            ctx.log.error(error);
            http.reply({
                folder: [],
                isFile: false,
                msg: error
            });
        }
    }
};
