/**
 * event listener for test purpose.
 * an event always has to be defined in this structure with name string and invoke method.
 * invoke will be called when the event has been fired.
 */ 
module.exports = {
  
  name: 'slimple.echo',
  invoke: function(ctx, data){
      ctx.log.trace("slimple.echo: " + data);
  }
    
};