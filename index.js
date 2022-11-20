const qrcode = require('qrcode-terminal');

const { Client, LocalAuth  } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()

});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
const number = "1111111111111@c.us"
const text = "Hola ma!";

client.on('ready', () => {
    console.log('Client is ready!');
    
    client.sendMessage(number, text);
});

client.on('message', message => {
    console.log(message.from, message.body, );
    if (message.body === 'ping') {
        message.reply('pong');
    }
    if(message.from === number){
        for(let i = 0; i < 10; i++){
            message.reply('pong');
        }
    }
});

client.initialize();
