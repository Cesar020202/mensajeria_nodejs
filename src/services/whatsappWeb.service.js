const { Client , LocalAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    webVersionCache: {
        type: "remote",
        remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({
        dataPath: './src/session_whatsapp'
    })
});

async function initialize() {
    // client.on('ready',  async () => {
    //     console.log('Client is ready!');
    //     // await client.sendMessage('51955596636', 'Hola, soy un bot de prueba');
    // });
    
    // client.on('qr', qr => {
    //     console.log('QR RECEIVED SERVICE', qr);
    //     // renderQR(qr);
    //     // qrcode.generate(qr, {small: true});
    // });

    // Escuchamos mensajes
    client.on('message', async (msg) => {
        const msgBody = msg.body;
        const from = msg.from;

        console.log('from', from);
        console.log('msg', msgBody);
        // await client.sendMessage('51965819150@c.us', 'eres un botcito 3.99');
        // if (msg.body === '!send-media') {
        //     const media = new MessageMedia('image/png', base64Image);
        //     await client.sendMessage(msg.from, media);
        // };
    });
    
    client.initialize();
};

async function sendMessage(number, message) {

    if(client.info == null)
    return 'Cliente no inicializado.'

    let number_ = number;

    if(number && !number.includes('@')){
        number_ += '@c.us';
        // number_ = await client.getNumberId(number);
        // if(number_){
        //     number_ = number_._serialized;
        // };
    };

    if(!number_){
        return 'Numero no valido.';
    };

    const response = await client.sendMessage(number_, message);
    return response;
};


module.exports = {  
    initialize,
    sendMessage,
    client
};
