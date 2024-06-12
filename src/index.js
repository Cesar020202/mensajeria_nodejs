// Path: src/index.js
const express = require('express');
const qrcode = require('qrcode');
const path = require('path');
const apiRouter = require('./routers/routes');
const whatsappWebController = require('./services/whatsappWeb.service');
const { status } = require('express/lib/response');

// Initialize whatsapp web
// const client = 

const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 4000;

// Configuramos vistas para front
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta para renderizar la vista
app.get('/', async (req, res) => {
  try {

    const info = whatsappWebController.client.info;

    console.log('whatsappWebController.client.info', info);
    if(!info){
      await whatsappWebController.initialize();
    };  

    whatsappWebController.client.on('qr', async ( qr) => {
      console.log('QR RECEIVED SERVICE', qr);
      const qrData = qr; // Datos para generar el QR
      const qrCodeUrl = await qrcode.toDataURL(qrData);
      res.render('home/qr-component/qr-component', { qr : qrCodeUrl , status: 'pending'});
      // renderQR(qr);
      // qrcode.generate(qr, {small: true});
    });

    if(info){
      console.log('info', info);
      // console.log('batery', (await whatsappWebController.client.info.getBatteryStatus()));

      whatsappWebController.client.on('ready',  async () => {
        console.log('Client is ready!');
        res.render('home/qr-component/qr-component', { info : info , status: 'success'});
        // await client.sendMessage('51955596636', 'Hola, soy un bot de prueba');
      });


      res.render('home/qr-component/qr-component', { info : info , status: 'success'});
    };

   
   
  } catch (err) {
    console.log('Error generando el código QR', err);
    res.status(500).send('Error generando el código QR');
  }
});


// Configuramos endpoints para back
app.use(express.json());
app.use('/api', apiRouter);

// app.use('/src/services', express.static(path.join(__dirname, 'services'), { 'Content-Type': 'application/javascript' }));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

