const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getImei, setImei } = require('./config');
const imeis = new Map();

const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const Device = require('./models/Device');
const app = express();
const http = require('http'); // Agregado para el servidor HTTP
const WebSocket = require('ws'); // Agregado para WebSocket
const PORT = process.env.PORT || 3001;
let mensajesRecibidos = [];
const net = require('net');

// Configuración del servidor HTTP y WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // WebSocket usando el servidor HTTP

// Enviar datos a todos los clientes conectados
function broadcastData(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}



// Configuración del servidor TCP para recibir datos del GPS
const gpsServer = net.createServer((socket) => {
    console.log('Nueva conexión de GPS');

    socket.on('data',async (data) => {
        console.log('Datos recibidos:', data);

        if (data.length >= 2 && data[0] === 0x78 && data[1] === 0x78 && data[3] === 0x01) {
            console.log('Mensaje de registro recibido');
            const response = Buffer.from([0x78, 0x78, 0x05, 0x01, 0x00, 0x01, 0xD9, 0xDC, 0x0D, 0x0A]);
            socket.write(response);
            console.log('Respuesta de confirmación enviada');
            return;
        } else if (data.length >= 4 && data[3] === 0x12) {
            console.log('Mensaje de ubicación recibido');
            
            try {
                const parsedData = parseLocation(data);
                console.log(parsedData)
                const decodedLat = decodeGt06Lat(parsedData.lat, parsedData.course);
                const decodedLon = decodeGt06Lon(parsedData.lon, parsedData.course);
                const imei = socket.remoteAddress
                const deviceData = {
                    imei,
                    decodedLat,
                    decodedLon,
          
                
                  };
                  await axios.post('http://localhost:3001/devices/update-from-gps', deviceData);

                console.log('Latitud decodificada:', decodedLat);
                console.log('Longitud decodificada:', decodedLon);

                // Enviar coordenadas a los clientes conectados mediante WebSocket
                broadcastData({ lat: decodedLat, lon: decodedLon, speed: parsedData.speed });
            } catch (err) {
                console.error('Error al parsear los datos:', err.message);
            }
            return;
        } else {
            console.log('Mensaje desconocido recibido');
        }
    });

    socket.on('end', () => {
        console.log('Cliente desconectado');
    });

    socket.on('error', (err) => {
        console.error('Error:', err);
    });
});

// Funciones para parsear la ubicación
function parseLocation(data) {
    let datasheet = {
        startBit: data.readUInt16BE(0),
        protocolLength: data.readUInt8(2),
        protocolNumber: data.readUInt8(3),
        fixTime: data.slice(4, 10),
        quantity: data.readUInt8(10),
        lat: data.readUInt32BE(11),
        lon: data.readUInt32BE(15),
        speed: data.readUInt8(19),
        course: data.readUInt16BE(20),
        mcc: data.readUInt16BE(22),
        mnc: data.readUInt8(24),
        lac: data.readUInt16BE(25),
        cellId: parseInt(data.slice(27, 30).toString('hex'), 16),
        serialNr: data.readUInt16BE(30),
        errorCheck: data.readUInt16BE(32)
    };
    return datasheet;
}

function decodeGt06Lat(lat, course) {
    var latitude = lat / 30000.0 / 60.0;
    if (!(course & 0x0400)) {
        latitude = -latitude;
    }
    return Math.round(latitude * 1000000) / 1000000;
}

function decodeGt06Lon(lon, course) {
    var longitude = lon / 30000.0 / 60.0;
    if (!(course & 0x0800)) {
        longitude = -longitude;
    }
    return Math.round(longitude * 1000000) / 1000000;
}

// Inicia el servidor TCP en el puerto 4000
gpsServer.listen(4000, () => {
    console.log('Servidor TCP escuchando en el puerto 4000');
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

// Ruta de SMS
app.post('/sms', async (req, res) => {
    // Aquí va el código existente para el endpoint SMS
});

// Inicia el servidor HTTP y WebSocket en el puerto especificado
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
