/**
 * Example of a REST service
 */
module.exports = {

    // resource path for this service
    // () = optional part of the path
    // :var = path variable, data available in http.data
    // * = wildcard, array of data available in http.data.splat
    resource: '(/:what)(/*)',
    
    /**
     * GET request handler
     */ 
    GET: function(ctx, http){

        // run some tests
        this.handleErrors(ctx, http);
        this.eventTest(ctx, http);
        this.contextTest(ctx, http);
        var sessionInfo = this.sessionTest(ctx, http);

        // send back some data
        http.reply({
            input: http.data,
            session: sessionInfo
        });
    },
    
    /**
     * POST request handler
     */
    POST: function(ctx, http){
        http.reply(http.data);
    },

    /**
     * Example: throw an error which will be passed directly back in the response
     */
    handleErrors: function(ctx, http){
        if(http.data.what === 'error'){
            throw { status: 500, error : new Error("problem occured in echo service").stack};
        }
    },

    /**
     * Example: how to get and set session attributes
     */
    sessionTest: function(ctx, http){
        var counter = http.session.get('counter');
        counter = counter ? ++counter : 1;        
        http.session.set('counter', counter);
        var sessionId = http.session.uid();
        ctx.log.trace(sessionId + " > counter = " + counter);
        return {
            sessionId: sessionId,
            counter: counter
        }
    },

    /*
     * Example: fire a server side event
     */
    eventTest: function(ctx, http){
        ctx.event.emit("slimple.echo", "call from service");
    },

    /*
     * Example: call a function from the app context
     */
    contextTest: function(ctx, http){
        ctx.test("call from service");
    }

};
