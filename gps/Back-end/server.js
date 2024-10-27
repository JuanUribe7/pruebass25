const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const Device = require('./models/Device');
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


app.post('/sms', async (req, res) => {
    const messageBody = req.body.Body;
    const fromNumber = req.body.From;
    const normalizedFromNumber = fromNumber.replace(/[^0-9]/g, '');

    const regex = /\/place\/([-+]?\d*\.\d+),([-+]?\d*\.\d+)\//;
    const match = messageBody.match(regex);

    if (match) {
        const latitud = parseFloat(match[1]);
        const longitud = parseFloat(match[2]);

        try {
            if(normalizedFromNumber==="573002694294"){
                const updatedDevice = await Device.findOneAndUpdate(
                    { imei: '1234'}, // Condición de búsqueda
                    { $set: { 'coordenadas.latitud': latitud, 'coordenadas.longitud': longitud } }, // Actualización
                    { new: true } // Retorna el documento actualizado
                );
    
                if (updatedDevice) {
                    console.log('Dispositivo actualizado:', JSON.stringify(updatedDevice, null, 2));
    
                    mensajesRecibidos.push({ from: fromNumber, body: messageBody });
                    return res.send(`
                        <Response>
                            <Message>Coordenadas actualizadas correctamente.</Message>
                        </Response>
                    `);
                } else {
                    console.log('Dispositivo no encontrado.');
                    return res.send(`
                        <Response>
                            <Message>No se encontró el dispositivo con el IMEI especificado.</Message>
                        </Response>
                    `);
                }
            }
                

                if(normalizedFromNumber==="573042157518"){
                    console.log(fromNumber)
                    const updatedDevice = await Device.findOneAndUpdate(
                        { imei: '3015' }, // Condición de búsqueda
                        { $set: { 'coordenadas.latitud': latitud, 'coordenadas.longitud': longitud } }, // Actualización
                        { new: true } // Retorna el documento actualizado
                    );
        
                    if (updatedDevice) {
                        console.log('Dispositivo actualizado:', JSON.stringify(updatedDevice, null, 2));
        
                        mensajesRecibidos.push({ from: fromNumber, body: messageBody });
                        return res.send(`
                            <Response>
                                <Message>Coordenadas actualizadas correctamente.</Message>
                            </Response>
                        `);
                    } else {
                        console.log('Dispositivo no encontrado.');
                        return res.send(`
                            <Response>
                                <Message>No se encontró el dispositivo con el IMEI especificado.</Message>
                            </Response>
                        `);
                    }
                }
            // Actualizar en la base de datos solo si el IMEI coincide
            if(normalizedFromNumber==="573103479455"){
                console.log(fromNumber)
                const updatedDevice = await Device.findOneAndUpdate(
                    { imei: '863829074212901' }, // Condición de búsqueda
                    { $set: { 'coordenadas.latitud': latitud, 'coordenadas.longitud': longitud } }, // Actualización
                    { new: true } // Retorna el documento actualizado
                );
    
                if (updatedDevice) {
                    console.log('Dispositivo actualizado:', JSON.stringify(updatedDevice, null, 2));
    
                    mensajesRecibidos.push({ from: fromNumber, body: messageBody });
                    return res.send(`
                        <Response>
                            <Message>Coordenadas actualizadas correctamente.</Message>
                        </Response>
                    `);
                } else {
                    console.log('Dispositivo no encontrado.');
                    return res.send(`
                        <Response>
                            <Message>No se encontró el dispositivo con el IMEI especificado.</Message>
                        </Response>
                    `);
                }
            }
          
        } catch (error) {
            console.error('Error al actualizar las coordenadas:', error);
            return res.status(500).send(`
                <Response>
                    <Message>Error al actualizar las coordenadas.</Message>
                </Response>
            `);
        }
    } else {
        console.log("No se encontraron coordenadas en el mensaje.");
    }

    // Esta respuesta solo se envía si no se encontraron coordenadas
    console.log(`Mensaje recibido de ${fromNumber}: ${messageBody}`);
    mensajesRecibidos.push({ from: fromNumber, body: messageBody });

    // Esta línea es para responder a todos los mensajes, incluso si no contienen coordenadas.
    return res.send(`
        <Response>
            <Message>Gracias por tu mensaje, lo hemos recibido.</Message>
        </Response>
    `);
});


/* app.post('/sms', async (req, res) => {
    const messageBody = req.body.Body;
    const fromNumber = req.body.From;

    const regex = /\/place\/([-+]?\d*\.\d+),([-+]?\d*\.\d+)\//;
    const match = messageBody.match(regex);

    if (match) {
        const latitud = parseFloat(match[1]);
        const longitud = parseFloat(match[2]);

        try {
            // Actualizar en la base de datos solo si el IMEI coincide
            const updatedDevice = await Device.findOneAndUpdate(
                { imei: '863829074212901' }, // Condición de búsqueda
                { $set: { 'coordenadas.latitud': latitud, 'coordenadas.longitud': longitud } }, // Actualización
                { new: true } // Retorna el documento actualizado
            );
            if (updatedDevice) {
                console.log('Coordenadas actualizadas:', updatedDevice);
                res.send(`
                    <Response>
                        <Message>Coordenadas actualizadas correctamente.</Message>
                    </Response>
                `);
            } else {
                console.log('Dispositivo no encontrado.');
                return res.send(`
                    <Response>
                        <Message>No se encontró el dispositivo con el IMEI especificado.</Message>
                    </Response>
                `);
            }
        } catch (error) {
            console.error('Error al actualizar las coordenadas:', error);
            return res.status(500).send(`
                <Response>
                    <Message>Error al actualizar las coordenadas.</Message>
                </Response>
            `);
        }

        console.log(`Latitud: ${latitud}, Longitud: ${longitud}`);
        // Aquí puedes guardar las coordenadas en la base de datos o en otra estructura
    } else {
        console.log("No se encontraron coordenadas en el mensaje.");
    }

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
}); */

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
