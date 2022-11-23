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

client.on('ready', () => {
    console.log('Client is ready!');

    //client.sendMessage(number, text);
});
timeOld =  new Date();

client.on('message', message => {
    console.log(message.from, message.body);
    if (message.body.toLowerCase() === 'ping') {
        message.reply('pong');
    }
    if(message.from == number && (Math.abs(new Date() - timeOld) > 2000000 ) ){
        timeOld = new Date();
        message.reply(text)
    }
    if(message.from == number && message.body.toLowerCase() == "confirmar"){
        message.reply("Gracias por confirmar tu suscripción. Ahora recibirás las notificaciones de la Municipalidad de San Miguel de Tucumán.")
    }
    if(message.body.toLowerCase().startsWith("https") ) {
        message.reply("link")
    }
});

client.initialize();
