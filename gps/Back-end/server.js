const net = require('net');
const axios = require('axios'); // Asegúrate de tener axios instalado e importado
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path'); 
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const Gt06 = require('./gt06'); // Asegúrate de tener el módulo Gt06
const mqtt = require('mqtt');
const getCrc16 = require('./crc16');
const routes = require('./routes/routes');
const notificacionRoutes = require('./routes/notificaciones');
const { WebSocketServer } = require('ws');
const iniciarWatcher = require('./utils/notificationWatcher');
const Notification = require('./models/notification'); // Importa el modelo de notificación
const Alert = require('./models/Alert'); // Importa el modelo de alerta
const formatearFecha = require('./utils/expresiones');

const PORT = process.env.GT06_SERVER_PORT || 4000;
const HTTP_PORT = process.env.HTTP_PORT || 80;
const rootTopic = process.env.MQTT_ROOT_TOPIC || 'gt06';
const brokerUrl = process.env.MQTT_BROKER_URL || '11ec3ffa829840c785105a23a3994db1.s1.eu.hivemq.cloud';
const brokerPort = process.env.MQTT_BROKER_PORT || 1883;
const mqttProtocol = process.env.MQTT_BROKER_PROTO || 'mqtt';
const brokerUser = process.env.MQTT_BROKER_USER || 'DiegoGPS';
const brokerPasswd = process.env.MQTT_BROKER_PASSWD || 'Dl1042248136!';


app.get('/send-command/:commandNumber', (req, res) => {
    const commandNumber = parseInt(req.params.commandNumber, 10);
    SendCommand(commandNumber);
    res.send(`Command ${commandNumber} sent to GPS`);
}); 
// Configuración del cliente MQTT
const mqttClient = mqtt.connect({
    protocol: mqttProtocol,
    host: brokerUrl,
    port: brokerPort,
    username: brokerUser,
    password: brokerPasswd
});

mqttClient.on('connect', () => {
    console.log('Cliente MQTT conectado');
});

mqttClient.on('error', (err) => {
    console.error('Error en la conexión MQTT:', err);
});

app.use(express.static(path.join(__dirname, 'dist' )));

// Servidor TCP
let cliente = null;
let imei = null;



var tcpServer = net.createServer((client) => {
    var gt06 = new Gt06();
    cliente=client;
    console.log('client connected');
    

    client.on('error', (err) => {
        console.error('client error', err);
    });

    client.on('close', () => {
        console.log('client disconnected');
    });

    client.on('data', async (data) => {
        try {
            gt06.parse(data);
        } catch (e) {
            console.log('err', e);
            return;
        }
        console.log(gt06);
        if (gt06.expectsResponse) {
            client.write(gt06.responseMsg);
        }
        gt06.msgBuffer.forEach(async (msg) => {
            mqttClient.publish(rootTopic + '/' + gt06.imei + '/pos', JSON.stringify(msg));
            
            // Preparar los datos para enviar a la ruta /update-from-gps
            if (gt06.event.string === 'location') {
                const gpsTime = new Date(gt06.fixTime);
            imei = gt06.imei;
                // Convertir a la hora local
                const localTime = new Date(gpsTime.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
                
                // Formatear la hora local en ISO 8601
                const localTimeISO = localTime.toISOString();
                const deviceData = {
                    imei: gt06.imei,
                    Lat: gt06.lat,
                    Lon: gt06.lon,
                    speed: gt06.speed,
                    course: gt06.course,
                    time: localTimeISO,
                    ignition: gt06.terminalInfo ? Boolean(gt06.terminalInfo.ignition) : false,
                    charging: gt06.terminalInfo ? Boolean(gt06.terminalInfo.charging) : false,
                    gpsTracking: gt06.terminalInfo ? Boolean(gt06.terminalInfo.gpsTracking) : false,
                    relayState: gt06.terminalInfo ? Boolean(gt06.terminalInfo.relayState) : false
                };
                const historyData = {
                    imei: gt06.imei,
                    lat: gt06.lat,
                    lon: gt06.lon,
                    speed: gt06.speed,
                    course: gt06.course,
                    fixTime: localTimeISO
                };
            
                console.log(
                    gt06.terminalInfo ? gt06.terminalInfo.ignition : 'undefined',
                    gt06.terminalInfo ? gt06.terminalInfo.charging : 'undefined',
                    gt06.terminalInfo ? gt06.terminalInfo.gpsTracking : 'undefined',
                    gt06.terminalInfo ? gt06.terminalInfo.relayState : 'undefined'
                );
            
                // Enviar los datos a la ruta /update-from-gps
                try {
                    await axios.post(`http://3.12.147.103/devices/update-from-gps`, deviceData);
                    await axios.post(`http://3.12.147.103/devices/save-history`, historyData);  

                    console.log(`Datos enviados a /update-from-gps para IMEI: ${gt06.imei}`);
                } catch (error) {
                    console.error('Error al enviar los datos:', error);
                }
            }
           
        }); 
       
               
        
        gt06.clearMsgBuffer();
    });
}); 

// Inicia el servidor TCP en el puerto especificado
tcpServer.listen(PORT, () => {
    console.log(`Servidor TCP corriendo en el puerto ${PORT}`);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect('mongodb+srv://lospopulare:gps1234@gps.zgbl7.mongodb.net/proyecto?retryWrites=true&w=majority&appName=gps', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.use('/auth', authRoutes);
app.use('/devices', deviceRoutes);
app.use('/routes', routes);
app.use('/notificaciones', notificacionRoutes);




async function SendCommand(commandNumber) {
    let commandBuffer;
    let alertaName;
    switch (commandNumber) {
        case 0: // Apagar el carro
          commandBuffer = Buffer.from([0x78, 0x78, 0x15, 0x80, 0x0F, 0x00, 0x01, 0xA9, 0x61, 0x44, 0x59, 0x44, 0x2C, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x23, 0x00, 0xA0, 0x3E, 0x10, 0x0D, 0x0A]);
          alertaName = 'Combustible cortado';
          break;
        case 1: // Encender el carro
          commandBuffer = Buffer.from([0x78, 0x78, 0x16, 0x80, 0x10, 0x00, 0x01, 0xA9, 0x63, 0x48, 0x46, 0x59, 0x44, 0x2C, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x23, 0x00, 0xA0, 0x7B, 0xDC, 0x0D, 0x0A]);
          alertaName = 'Combustible restablecido';
          break;
        default:
          console.error('Comando no reconocido');
          return;
      }
    
      if (cliente) {
        cliente.write(commandBuffer);
        console.log('Command sent:', commandBuffer.toString('hex'));
        const time =  new Date().toISOString();
        // Guardar la notificación en la base de datos
        const notification = new Notification({
          imei: "863829070233398",
          notificationName: alertaName ,
          notificationTime: time,
          notificationType: 'Control'
          
        });
        const alert = new Alert({
            imei: imei,
            alertName: alertaName,
            alertTime: time,
            alertType: 'control'
        });
          try {
            await notification.save();
            await alert.save();
            console.log('Notificación guardada en la base de datos');
          } catch (error) {
            console.error('Error al guardar la notificación en la base de datos:', error);
          }
    } else {
        console.error('No GPS client connected');
    }
}
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Inicia el servidor HTTP en el puerto especificado
const server=app.listen(HTTP_PORT, () => {
    console.log(`Servidor HTTP corriendo en http://localhost:${HTTP_PORT}`);
});
const wss = new WebSocketServer({ server });
iniciarWatcher(wss);

wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');

    // Puedes manejar mensajes del cliente si es necesario
    ws.on('message', (message) => {
        console.log('Mensaje recibido:', message);
    });

    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado');
    });
});