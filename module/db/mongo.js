 var mongo = require('mongoose');
//var config = require(process.cwd()+'/config/db');

module.exports = {

    mongoose: mongo,
    schemas : [],
    db: {},
    models: [],
    
    /**
     * create the connection
     */ 
    initialize: function(ctx){
        var that = this;
        this.db = mongo.createConnection(
            ctx.config.db.connectionString,
            ctx.config.db.connectionProperties
        );
        
        // bind db specific events
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', function callback () {
          ctx.log.info('DB connected');
        });
        this.db.on('disconnected', function () {
          ctx.log.info('DB disconnected');
        });

        // close mongoose connection when app was killed
        // TODO check if SIGTERM also works
        process.on('SIGINT', function() {
            that.db.close(function () {
                process.exit(0);
            });
        });

    },
    
    /**
     * give a callback the db connection for performing db operations.
     * @deprecated
     */
    perform : function(callback) {
        callback(this.db);
    },
    /**
     * get a model or create one with an existing schema
     */ 
    model: function(name){
        if(this.models[name]){
            return this.models[name];
        } else {
            var dbSchema = new mongo.Schema(this.schemas[name].schema);
            this.models[name] = this.db.model(name, dbSchema);
            return this.models[name];
        }
    },
    
    getSchema: function(name){
        return this.schemas[name].schema;
    },
    setSchemas: function(schemas){
      this.schemas = schemas;  
    },
    getSchemas: function(){
        return this.schemas;
    }
    
};