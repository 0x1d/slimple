var EventEmitter = require('events').EventEmitter;
var Way = require('wayjs');
var objUtil = require("../util/obj");

module.exports = {
    
    build: function(appConfig, appContext){
            
        function bindServices(ctx){
            var serviceLoader = require('../core/loader/serviceLoader');
            serviceLoader.loadServices(ctx);
            ctx.services = serviceLoader.serviceHolder;
        }        
        
        function bindSchemas(ctx){
            var schemaLoader = require('../core/loader/schemaLoader');
            ctx.db.schemas = schemaLoader.loadSchemas(ctx);
        }

        function bindEvents(ctx){
            var eventLoader = require('../core/loader/eventLoader');
            eventLoader.bindEvents(ctx);
        }
        
        var context = {
            config: appConfig,
            log: require('../log/logger'),
            web: {
                content: require('../web/content'),
                requestHandler: require('../web/requestHandler'),
                responseHandler: require('../web/responseHandler'),
                statusResponse: require('../web/statusResponse')
            },
            util:{
                json: require('../util/json/jsonUtil'),
            },
            event: new EventEmitter(),
            way: new Way()

        };
        
        // bind db stuff if active
        if(appConfig.db.active){
            var mongo = require('../db/mongo');
            mongo.initialize(context);
            context.db = mongo;
            bindSchemas(context);
        }
        // bind  events, services and schema to context
        bindEvents(context);
        bindServices(context);
        
        
        // extend the context if it is set
        if(appContext !== null){    
            context = objUtil.extend(context, appContext);
            appContext = context;
        }
        return context;
        
    }
};