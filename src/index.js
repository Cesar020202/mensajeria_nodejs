// Path: src/index.js
const express = require('express');
const qrcode = require('qrcode');
const path = require('path');
const apiRouter = require('./routers/routes');
const whatsappWebController = require('./services/whatsappWeb.service');


const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 4520;

// Configuramos vistas para front
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

whatsappWebController.initialize();

// Ruta para renderizar la vista
// app.get('/qr', async (req, res) => {
//   try {

//     console.log('vista /')
//     // Tomo la referencia del client
//     // const info = whatsappWebController.client.info;
//     // console.log('Client info', info);

//     // // Initialize whatsapp web
//     // if(!info){
     
//     // };  

//     whatsappWebController.client.on('qr', async ( qr) => {
//       console.log('QR RECEIVED SERVICE', qr);
//       const qrData = qr; // Datos para generar el QR
//       const qrCodeUrl = await qrcode.toDataURL(qrData);
//       res.render('home/qr-component/qr-component', { qr : qrCodeUrl , status: 'pending'});
//     });

//     whatsappWebController.client.on('ready',  async () => {
//       console.log('Client is ready!' , whatsappWebController.client.info);
//       const info_ = whatsappWebController.client.info;
//       res.redirect('home/qr-component/qr-component', { info : info_ , status: 'success'});
//     });
   
//   } catch (err) {
//     console.log('Error generando el código QR', err);
//     res.status(500).send('Error generando el código QR');
//   }
// });

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

whatsappWebController.client.on('qr', async (qr) => {
  console.log('QR RECEIVED SERVICE', qr);
  qrCodeUrl = await qrcode.toDataURL(qr);
  clientReady = false;
});

whatsappWebController.client.on('ready', () => {
  console.log('Client is ready!', whatsappWebController.client.info);
  clientInfo = whatsappWebController.client.info;
  clientReady = true;
});

whatsappWebController.client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
  clientInfo = whatsappWebController.client.info;
  clientReady = false;
});

// Configuramos endpoints para back
app.use(express.json());
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

