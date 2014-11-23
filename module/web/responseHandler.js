var content = require('./content');

function reply(response, status, data){
    response.writeHead(status);
    if(data){
        if(data.constructor == Object || data.constructor == Array){
            response.write(JSON.stringify(data));
        } else {
            response.write(data);
        }
    } else {
        response.write('');
    }
	response.end();
} exports.reply = reply;

function writeJson(response, data){
	response.writeHead(200, { 'Content-Type': 'text/html' });
	response.write(JSON.stringify(data));
	response.end();
} exports.writeJson = writeJson;

/**
* quite a useless method
*/
function redirect(response, contentName){
	content.serve(contentName, response);
} exports.redirect = redirect;