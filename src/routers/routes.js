const express = require('express');

const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');
// const whatsappWebController = require('../services/whatsappWeb.service');

router
.get('/', whatsappController.verifyToken)
.post('/', whatsappController.ReceiveMessage)
.post('/sendMessageWeb', whatsappController.sendMessageByWeb)
.post('/sendMessageMeta', whatsappController.sendMessageByMeta)
.post('/sendMessageWbMt', whatsappController.sendMessageWbMt);


module.exports = router;