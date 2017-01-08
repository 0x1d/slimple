var EventEmitter = require('events').EventEmitter;
//var config = require(process.cwd()+"/admin/config/log");
var Enum = require("../util/enum");


/**
 * Use this logger to log "log4J"-style.
 * It emitts events so the appenders function.
 * Supported levels at the moment: TRACE, ERROR, INFO, DEBUG, FATAL
 *
 * NOTE: This class is still under development at the moment.
 */

var LEVEL = Enum.define({
    TRACE   : { value : 0, string : 'TRACE' },
    DEBUG   : { value : 1, string : 'DEBUG' },
    INFO    : { value : 2, string : 'INFO' },
    ERROR   : { value : 3, string : 'ERROR' },
    FATAL   : { value : 4, string : 'FATAL' }
});

module.exports = {

    config : {
        logLevel : "INFO"
    },
    emitter : new EventEmitter(),

    trace : function(message) {
		this.printMessage(LEVEL.TRACE.string, message);
	},

    debug : function(message) {
		this.printMessage(LEVEL.DEBUG.string, message);
	},

	info : function(message) {
		this.printMessage(LEVEL.INFO.string, message);
	},

    error : function(message) {
		this.printMessage(LEVEL.ERROR.string, message);
	},

    fatal : function(message) {
		this.printMessage(LEVEL.FATAL.string, message);
	},

    printMessage : function(level, message) {
        if(LEVEL.getByName(this.config.logLevel).value <= LEVEL.getByName(level).value){
            var now = new Date();
            message = now.toISOString()+" [" + level + "] " + message;
            this.emitter.emit('append',message);
        }
    }

};
