function requestEntityTooLarge(error, response){
    response.writeHead(413, {'Content-Type': 'text/plain'});
    response.write("<h1>413 / Request Entity too Large</h1><br>"+error);
	response.end();
} exports.requestEntityTooLarge = requestEntityTooLarge;

function methodNotSupported(error, response){
	response.writeHead(405, {'Content-Type': 'text/plain'});
    response.write("<h1>405 / Method Not Supported</h1><br>"+error);
	response.end();
} exports.methodNotSupported = methodNotSupported;

function generalError(error, response){
    response.writeHead(500);
    response.write("<h1>500 / Internal Server Error</h1><br>"+error);
	response.end();
} exports.generalError = generalError;

function notFound(error, response){
    response.writeHead(404);
    response.write("<h1>404 / Not Found</h1><br>"+error);
	response.end();
} exports.notFound = notFound;