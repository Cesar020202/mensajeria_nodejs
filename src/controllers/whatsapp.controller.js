const fs = require('fs');   
const myConsole = new console.Console(fs.createWriteStream('./logswpp.txt'));
const whatsappService = require('../services/whatsapp.service');
const whatsappWebService = require('../services/whatsappWeb.service');
const processMessageService = require('../shared/process.message');

const verifyToken = (req , res) => {

    try {
        var accessToken = 'RTX2024';
        var token = req.query['hub.verify_token'];
        var challenge = req.query['hub.challenge'];

        if (challenge && token && token === accessToken) {
            res.status(200).send(challenge);
        }else{
            res.status(400).send();
        };
        
    } catch (e) {
        res.status(400).send();
    };

};

const ReceiveMessage = (req , res) => {
    try {
        // console.log(req);
        var entry = req.body['entry'][0];
        var changes = entry['changes'][0];
        var value = changes['value'];
        var messageObject = value['messages'];

        if(typeof messageObject !== 'undefined'){
            var messages = messageObject[0];
            console.log(messages);
            var text = GetTextUser(messages);
            var number = messages['from'];

            console.log('number', number);

            // validamos si me cliente existe en bd, si existe le mandamos listado de servicios
            // si no existe le mandamos mensaje de bienvenida
            processMessageService.processByCliente(text, number , 'Gemini');
            // whatsappService.sendMessageWhatsap("El usuario dijo : "+text, number);
            // whatsappService.sendMessageListWhatsap("El usuario dijo : "+text, number);
        };
       

        res.send("EVENT_RECEIVED");
    } catch (e) {
        console.log('error');
        res.send("EVENT_RECEIVED");
    };

    function GetTextUser(messages) {
        var text = "";
        var typeMessage = messages['type'];
        if(typeMessage == 'text'){
            text = messages['text']['body'];    
        }else if(typeMessage == 'interactive'){

            var interactiveObj = messages['interactive'];
            var typeInteractive = interactiveObj['type'];

            if(typeInteractive == 'button_reply'){
                text = interactiveObj['button_reply']['title'];
            } else if(typeInteractive == "list_reply"){
                text = interactiveObj['list_reply']['title'];
            } else{   
                myConsole.log('no se encontro el tipo de mensaje')
            };

        };
        
        return text;
    };

    // res.send('hola recive')
};

const sendMessageByWeb = async (req , res) => {
    const data = {
        mensajes : [],
        tipo     : 3,
        data     : null,
    };

    try {
        const number = req.body.number;
        const message = req.body.message;
        const response = await whatsappWebService.sendMessage(number , message);
        console.log('response', response);

        if(typeof response === 'string'){
            data.mensajes.push(response);
        };

        if(typeof response === 'object'){
            data.mensajes.push('Mensaje enviado con exito.');
            data.tipo = 1;
            data.data = response;
        };
      
        res.status(200).send(data);
    } catch (e) {
        console.log(e);
        res.status(200).send(data);
    };
    
};

const sendMessageByMeta = async (req , res) => {
    const data = {
        mensajes : [],
        tipo     : 3,
        data     : null,
    };

    try {
        const number = req.body.number;
        const message = req.body.message;
        const response =  whatsappService.sendMessageWhatsap(number , message);
        console.log('response', response);

        if(typeof response === 'string'){
            data.mensajes.push(response);
        };

        if(typeof response === 'object'){
            data.mensajes.push('Mensaje enviado con exito.');
            data.tipo = 1;
            data.data = response;
        };
      
        res.status(200).send(data);
    } catch (e) {
        console.log(e);
        res.status(200).send(data);
    };
    
};


module.exports = {
    verifyToken,
    ReceiveMessage,
    sendMessageByWeb,
    sendMessageByMeta
};