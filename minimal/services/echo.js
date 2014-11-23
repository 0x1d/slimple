module.exports = {

    resource: '/echo(/:what)(/*)',
    
    GET: function(ctx, http){
        http.reply({
            input: http.data
        });
    }

};
