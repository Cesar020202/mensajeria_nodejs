// Path: src/index.js
const express = require('express');
const qrcode = require('qrcode');
const path = require('path');
const apiRouter = require('./routers/routes');
const whatsappWebController = require('./services/whatsappWeb.service');
const { HTTP_RESPONSE } = require('./utility/utility');

const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 4000;

// Configuramos vistas para front
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Iniciamos ruta estatica
// app.use(express.static(__dirname + '/public'));

whatsappWebController.initialize();

let qrCodeUrl = null;
let clientReady = false;
let clientInfo = null;

app.get('/qr', (req, res) => {
  res.render('home/qr-component/qr-component', { qrCodeUrl, clientReady, clientInfo });
});

// Endpoint para obtener el estado actual
app.get('/qr-status', (req, res) => {
  res.json({ qrCodeUrl, clientReady, clientInfo });
});

// Endpoint para incializar el cliente
app.get('/start-client', async (req, res) => {

  const response = {
    tipo : HTTP_RESPONSE.SUCCESS
  };

  if (whatsappWebController.client && whatsappWebController.client.info) {
    console.log('Client is already initialized', whatsappWebController.client.info);
    return res.json({ message: 'Client is already initialized' });
  };

  await whatsappWebController.initialize();
  res.json({ message: 'Client initialized' });
});

// Endpoint para detener el cliente
app.get('/stop-client', async (req, res) => {
 
  if (whatsappWebController.client && whatsappWebController.client.info) {
    await whatsappWebController.client.logout();
    console.log('Stopping client' , whatsappWebController.client.info);
    res.json({ message: 'Client stopped' });
  }else{
    res.json({ message: 'Client is not initialized' });
  };
  
});

// Endpoint para resetear el cliente
app.get('/reset-client', async (req, res) => {

  if (whatsappWebController.client && whatsappWebController.client.info) {
    await whatsappWebController.client.resetState();
    res.json({ message: 'Client reseted' });
  }else{
    res.json({ message: 'Client is not initialized' });
  };

});

// Eventos de whatsapp web  
whatsappWebController.client.on('qr', async (qr) => {
  // console.log('QR RECEIVED SERVICE', qr);
  qrCodeUrl = await qrcode.toDataURL(qr);
  clientReady = false;
});

whatsappWebController.client.on('ready', () => {
  console.log('Client is ready!');
  // console.log('Client info', whatsappWebController.client.info);
  clientInfo = whatsappWebController.client.info;
  clientReady = true;
});

whatsappWebController.client.on('disconnected', (reason) => {
  // console.log('Client was logged out', reason);
  // whatsappWebController.client.destroy();
  clientReady = false;
  qrCodeUrl = null;
  clientInfo = whatsappWebController.client.info;
  console.log('Client info - disconnected', clientInfo);
});

// Configuramos endpoints para back
app.use(express.json());
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

