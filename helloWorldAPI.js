var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;


var server = http.createServer(function(req,res){

var parsedUrl = url.parse(req.url, true);

var path = parsedUrl.pathname;
var trimmedPath = path.replace(/^\/+|\/+$/g, '');
var decoder = new StringDecoder('utf-8');
var buffer = '';
req.on('data', function(data){
	buffer += decoder.write(data);
});

req.on('end', function(){
	buffer +=decoder.end();
var choosenHandler = typeof(router[trimmedPath]) !== 'undefined'? router[trimmedPath] : handlers.notFound;

var data = {
	'trimmedPath' : trimmedPath,
	'handlers' :handlers,
	'payload' : buffer

};

choosenHandler(data, function(statusCode,payload){
	statusCode = typeof(statusCode) == 'number'? statusCode : 200;
	payload = typeof(payload) == 'object'? payload : {};
	var payloadString = JSON.stringify(payload);

res.setHeader('Content-Type','application/json');
res.writeHead(statusCode);
res.end(payloadString);
console.log('Returning this response:',statusCode, payloadString);
})

})

});

server.listen(4000, function(){
	console.log('The server is listening on port 4000');
})

var handlers ={};
handlers.hello = function(data, callback){
	callback(306, {'note' : 'Hello World'});
};

handlers.notFound = function(data, callback){
	callback(404);
}

var router = {
	'hello' : handlers.hello
};