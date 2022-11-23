var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        //////////////////////////////////////////////
        const qrcode = require('qrcode-terminal');
        const { Client, LocalAuth  } = require('whatsapp-web.js');
        
        const client = new Client({
            authStrategy: new LocalAuth()
        
        });
        
        client.on('qr', qr => {
            qrcode.generate(qr, {small: true});
        });
        
        client.on('ready', () => {
            console.log('Client is ready!');
        
            //client.sendMessage(number, text);
        });
        
        
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            msgUtf = message.utf8Data
            connection.sendUTF(message.utf8Data);
            client.on('message', message => {
                
                client.sendMessage("5491128364834@c.us", msgUtf);
                
            });
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
        client.initialize();
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});