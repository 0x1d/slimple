module.exports = {
    context: require('./core/context'),
    server: require('./core/server'),
    logAppenders: [
        require('./log/consoleAppender.js')
        //require('./log/fileAppender.js')
    ],
    run: function(config, ctx){
		var appContext = this.context.build(config, ctx);
		var httpServer = this.server.httpd.start(appContext);
		return appContext;
    }
};