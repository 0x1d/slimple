module.exports = {

    resource: '(/:userId)',

    init: function(ctx, http){
        this.UserModel = ctx.db.model("User");
        this.data = http.data;
    },

    GET: function(ctx, http) {
        http.reply(http.data);
    },
    
    /*
     * update user
     */
    POST: function(ctx, http) {
        var service = this;
        service.init(ctx, http);
        if (service.data._id) {
            service.UserModel.findOne({
                _id: service.data._id
            }, function(err, existingRecord) {
                if(err){
                    http.reply({error: err});
                }
                var upd = ctx.util.json.mapData(service.data, existingRecord);
                upd.save(function(err, product, numberAffected) {
                    http.reply({msg: err});
                });
            });
        }
    },
    
    /*
     * create user
     * TODO encrypt password
     */
    PUT: function(ctx, http) {
        var service = this;
        service.init(ctx, http);
        var preparedData = ctx.util.json.mapData(service.data, {});
        var dbObject = new service.UserModel(preparedData);
        dbObject.save(function(val) {
            http.reply({msg: 'user saved'});
        });
    },
    
    DELETE: function(ctx, http) {
        http.reply(http.data);
    }

};