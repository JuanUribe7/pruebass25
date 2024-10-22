const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://lospopulare:gps1234@gps.zgbl7.mongodb.net/proyecto?retryWrites=true&w=majority&appName=gps', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Definición del esquema de usuario (para login)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Asegúrate de que el email sea único 
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Definición del esquema de dispositivo (para el CRUD)
const deviceSchema = new mongoose.Schema({
    deviceName: { type: String, required: true },
    responsible: { type: String, required: true },
    imei: { type: String, required: true, unique: true },
    status: { type: String, required: true },
});

const Device = mongoose.model('Device', deviceSchema);

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Aquí podrías manejar el token o la sesión
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// CRUD para dispositivos

// Listar todos los dispositivos
app.get('/devices', async (req, res) => {
    try {
        const devices = await Device.find({}, 'deviceName responsible status imei'); // Campos visibles
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Agregar un nuevo dispositivo
app.post('/devices', async (req, res) => {
    try {
        const { deviceName, responsible, imei, status } = req.body;

        // Validar los campos (opcional)
        if (!deviceName || !responsible || !imei || !status) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const nuevoDispositivo = new Device({ deviceName, responsible, imei, status }); // Cambié 'Dispositivo' a 'Device'
        await nuevoDispositivo.save();
        res.status(201).json(nuevoDispositivo); // Devolver el dispositivo creado
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el dispositivo: ' + error.message });
    }
});

// Actualizar un dispositivo
app.put('/devices/:id', async (req, res) => {
    try {
        const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedDevice) {
            return res.status(404).json({ message: 'Dispositivo no encontrado' });
        }
        res.json(updatedDevice);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error al actualizar el dispositivo: ' + error.message });
    }
});

// Eliminar un dispositivo
app.delete('/devices/:id', async (req, res) => {
    try {
        const deletedDevice = await Device.findByIdAndDelete(req.params.id);
        if (!deletedDevice) {
            return res.status(404).json({ message: 'Dispositivo no encontrado' });
        }
        res.json({ message: 'Dispositivo eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el dispositivo: ' + error.message });
    }
});

app.post('/sms', (req, res) => {
    const messageBody = req.body.Body; // El contenido del SMS
    const fromNumber = req.body.From;  // El número de teléfono que envió el mensaje

    console.log(`Mensaje recibido de ${fromNumber}: ${messageBody}`);

// Guardar el mensaje en la variable global
    mensajesRecibidos.push({ from: fromNumber, body: messageBody });

    // Aquí puedes procesar el mensaje como quieras
    // Puedes guardar en tu base de datos o hacer alguna lógica adicional

    // Twilio espera una respuesta, puedes enviar un mensaje de vuelta opcionalmente
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
