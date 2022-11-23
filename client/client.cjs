#!/usr/bin/env node
var WebSocketClient = require('websocket').client;

var clientWS = new WebSocketClient();

clientWS.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

clientWS.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    function sendMsg(msg){
        if (connection.connected) {
            connection.sendUTF(msg);
        }
    }
    //////////////////////////////////////////////
    const qrcode = require('qrcode-terminal');
    const { Client, LocalAuth  } = require('whatsapp-web.js');

    const client = new Client({
        authStrategy: new LocalAuth()

    });

    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });
    const number = "5491126147226@c.us"
    const text = "Hola, te has registrado correctamente en el sistema de notificaciones de la Municipalidad de San Miguel de Tucumán. Para confirmar tu suscripción, por favor, envía la palabra 'confirmar'";
    const rapo = "5491128364834@c.us"
    client.on('ready', () => {
        console.log('Client is ready!');

        //client.sendMessage(number, text);
    });
    timeOld =  new Date();

    client.on('message', message => {
        console.log(message.from, message.body);
        if (message.body === 'ping') {
            message.reply('pong');
        }
        sendMsg(message.body);
        if(message.from == number && (Math.abs(new Date() - timeOld) > 2000000 ) ){
            timeOld = new Date();
            message.reply(text)
        }
        if(message.from == number && message.body.toLowerCase() == "confirmar"){
            message.reply("Gracias por confirmar tu suscripción. Ahora recibirás las notificaciones de la Municipalidad de San Miguel de Tucumán.")
        }
        if(message.from == rapo  ){
            client.sendMessage(number, ".");
            connection.sendUTF(msg);
        }
    });

    client.initialize();
    

    sendMsg("Hola");
});



clientWS.connect('ws://localhost:8080/', 'echo-protocol');