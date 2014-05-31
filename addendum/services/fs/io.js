var fs = require('fs');

module.exports = {
	
	resource: '/io',

	/**
	 * Read a file from the fs
	 */
	GET: function(ctx, http){
		ctx.log.info(http.data.path);
		fs.readFile(http.data.path, "utf-8", function read(err, data) {
		    if (err) {
		        http.reply({ msg: err });
		    }
		    http.reply({content: data});
		});
	},
	/**
	 * Save a file to the fs
	 */
	POST: function(ctx, http) {
		fs.writeFile(http.data.path, http.data.content, function(err) {
		    if(err) {
		         http.reply({ msg: err });
		    }
	        http.reply({ msg: "The file was saved!" });
		}); 
	}
};