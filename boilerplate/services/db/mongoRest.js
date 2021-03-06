
module.exports = {

    resource: '/:schema(/:id)',

    init: function(ctx, http){
        var data = http.data;
        this.id = data.id;
        this.inputData = data.data ? JSON.parse(data.data) : null;
        this.query = this.inputData !== null && this.inputData.query ? JSON.parse(this.inputData.query) : null;
        this.schema = data.schema;
        this.schemaDefinition = ctx.db.getSchema(this.schema);
        this.model = ctx.db.model(this.schema);
    },

    GET: function(ctx, http){
        var service = this;
        service.init(ctx, http);
        if(service.id){ // read by id
            service.model.findById(service.id, function(error, result) {
                http.reply({data : result, schema: service.schemaDefinition, schemaName: service.schema});
            });
        } else if(service.query){ // find
            for (var k in service.query) { service.query[k] = new RegExp(service.query[k], 'i'); }
            service.model.find(service.query).execFind(function(error, result) {
                result = result ? result.reverse() : {};
                http.reply({data:result, schema:service.schemaDefinition, schemaName: service.schema}); // FIXME create a solution of last to oldest
            });
        }else { // read all
            service.model.find({}).execFind(function(error, result) {
                result = result ? result.reverse() : {}; // FIXME create a solution of last to oldest
                http.reply({data : result}); 
            });
        }
    },
    
    POST: function(ctx, http){
        var service = this;
        service.init(ctx, http);
        var preparedData = ctx.util.json.mapData(service.inputData, {});
        var dbObject = new service.model(preparedData);
        dbObject.save(function(error) {
            http.reply(error ? {msg:error} : { id : dbObject._id });
        });
    },
            
    PUT: function(ctx, http){
        var service = this;
        service.init(ctx, http);
        if(service.id){
            service.model.findOne({
                _id: service.id
            }, function(err, doc) {
                var upd = ctx.util.json.mapData(service.inputData, doc);
                upd.save(function(error) {
                    http.reply(error ? { msg : error } : {});
                });
            });
        } else {
            http.reply({msg:'no id specified'});
        }
    },

    DELETE: function(ctx, http) {
        var service = this;
        service.init(ctx, http);
        if(service.id){
            service.model.remove({
                _id: service.id
            }, function(error) {
                http.reply(error ? { msg : error } : {});
            });
        } else {
            http.reply({ msg : 'no id specified' });
        }
    }

};