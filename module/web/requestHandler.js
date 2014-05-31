var url = require("url");
var querystring = require("querystring");
var state = require('./statusResponse');

/**
* accepts the usual request methods and calls the corresponding handler
*/
function rest(request, response, callback) {

    if(request.method == 'POST') {
		handle(request, response, callback);
	} else if(request.method == 'GET') {
		handleUrl(request, response, callback);
	} else if(request.method == 'PUT') {
		handle(request, response, callback);
	} else if(request.method == 'DELETE') {
		handleUrl(request, response, callback);
	} else {  // not sure what request method was used, try the standard procedure
		handle(request, response, callback);
	}

} exports.rest = rest;

/**
* processes a request and pass the data as JSON  to the callback function.
* it also blocks nuke attacks
*/
function handle(request, response, callback) {
	var queryData = "";
	
	if(typeof callback !== 'function') return null;

		request.on('data', function(data) {
			queryData += data;
			
			if(queryData.length > 1e6) { // max length of post data: 1 000 000
				queryData = "";
				state.requestEntityTooLarge("max length of post data is 1 000 000 bytes", response);
				request.connection.destroy();
			}
		});

		request.on('end', function() {
			callback(querystring.parse(queryData));
		});

} exports.post = handle;

/**
* processes a request and passes the url param data as JSON to the callback function.
*/
function handleUrl(request, response, callback){

	if(typeof callback !== 'function') return null;
	
	if(request.method == 'GET' || request.method == 'DELETE') {
		callback(querystring.parse(url.parse(request.url).query));
	} else {
		state.methodNotSupported("request method is not supported by the server", response);
	}
} exports.get = handleUrl;