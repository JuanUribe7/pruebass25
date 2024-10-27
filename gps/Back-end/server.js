const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');

const app = express();
const PORT = process.env.PORT || 3001;
let mensajesRecibidos = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Navify_gps', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.use('/auth', authRoutes);
app.use('/devices', deviceRoutes);

app.post('/sms', (req, res) => {
    const messageBody = req.body.Body;
    const fromNumber = req.body.From;

    console.log(`Mensaje recibido de ${fromNumber}: ${messageBody}`);

    mensajesRecibidos.push({ from: fromNumber, body: messageBody });

    res.send(`
        <Response>
            <Message>Gracias por tu mensaje, lo hemos recibido.</Message>
        </Response>
    `);
});

app.get('/mensajes', (req, res) => {
    res.json(mensajesRecibidos);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
