const express = require('express');
const { Client } = require('whatsapp-web.js');

const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');
// const whatsappWebController = require('../services/whatsappWeb.service');



const client = new Client();

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    console.log(msg);
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();


router
.get('/', whatsappController.verifyToken)
.post('/', whatsappController.ReceiveMessage);

module.exports = router;