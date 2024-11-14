const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const { getImei, setImei } = require('../config');

// Listar todos los dispositivos
router.get('/', async (req, res) => {
    try {
        const devices = await Device.find({}, 'deviceName responsible status imei phoneNumber coordenadas');
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Agregar un nuevo dispositivo
router.post('/', async (req, res) => {
    try {
        const { deviceName, responsible, imei, phoneNumber } = req.body;

        if (!deviceName || !responsible || !imei) {
            return res.status(400).json({ error: 'Los campos deviceName, responsible e imei son obligatorios.' });
        }

        const nuevoDispositivo = new Device({
            deviceName,
            responsible, // Cambiado a 'responsible'
            imei,
            phoneNumber,
        });

        const dispositivoGuardado = await nuevoDispositivo.save();
        setImei(dispositivoGuardado._id.toString(), imei);
        console.log('IMEI guardado para dispositivo:', dispositivoGuardado._id, getImei(dispositivoGuardado._id.toString()));

        res.status(201).json(dispositivoGuardado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el dispositivo: ' + error.message });
    }
});
// Endpoint para actualizar la ubicación del dispositivo desde el GPS
router.post('/update-from-gps', async (req, res) => {
    try {
        const { imei, Lat, Lon, speed, course, time, eventNumber, eventString, mcc, mnc, lac, cellId, serialNr } = req.body;


        // Verificar que todos los datos requeridos estén presentes
        if (!imei || Lat === undefined || Lon === undefined) {
            return res.status(400).json({ error: 'IMEI, latitud y longitud son obligatorios.' });
        }

        // Encontrar el dispositivo por IMEI
        const dispositivo = await Device.findOne({ imei });

        if (!dispositivo) {
            return res.status(404).json({ message: 'Dispositivo no encontrado' });
        }

        // Actualizar las coordenadas del dispositivo
        dispositivo.status = {
            event: {
                number: eventNumber,
                string: eventString
            },
            fixTime: time,
            coordenadas: {
                latitud: Lat,
                longitud: Lon,
                velocidad: speed,
                rumbo: course,
                fecha: time
            },
            mcc: mcc,
            mnc: mnc,
            lac: lac,
            cellId: cellId,
            serialNr: serialNr
        };

        // Guardar los cambios en la base de datos
        await dispositivo.save();

        console.log(`Ubicación actualizada para IMEI: ${imei} - Latitud: ${Lat}, Longitud: ${Lon}`);
        res.json({ message: 'Ubicación actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar la ubicación:', error.message);
        res.status(500).json({ error: 'Error al actualizar la ubicación: ' + error.message });
    }
});

// Actualizar un dispositivo
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;
