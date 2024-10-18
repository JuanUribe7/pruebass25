const express = require('express');
const router = express.Router();
const Device = require('../models/device'); // Importar el modelo de dispositivo

// Listar todos los dispositivos
router.get('/devices', async (req, res) => {
    try {
        const devices = await Device.find({}, 'deviceName responsible imei'); // Campos visibles
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener dispositivos: ' + error.message });
    }
});

// Agregar un nuevo dispositivo
router.post('/devices', async (req, res) => {
    const { deviceName, responsible, status, imei } = req.body;

    // Validación de entrada
    if (!deviceName || !responsible || !imei) {
        return res.status(400).json({ message: 'Faltan campos requeridos: deviceName, responsible, imei.' });
    }

    const newDevice = new Device({
        deviceName,
        responsible,
        status: status || 'Desconectado', // Valor por defecto
        imei
    });

    try {
        const savedDevice = await newDevice.save();
        res.status(201).json(savedDevice);
    } catch (error) {
        if (error.code === 11000) { // Código de error por duplicado
            return res.status(400).json({ message: 'El IMEI ya existe.' });
        }
        res.status(400).json({ message: 'Error al guardar el dispositivo: ' + error.message });
    }
});

// Actualizar un dispositivo
router.put('/devices/:id', async (req, res) => {
    const { deviceName, responsible, status, imei } = req.body;

    // Validación de entrada
    if (!deviceName || !responsible || !imei) {
        return res.status(400).json({ message: 'Faltan campos requeridos: deviceName, responsible, imei.' });
    }

    try {
        const updatedDevice = await Device.findByIdAndUpdate(
            req.params.id,
            { deviceName, responsible, status, imei },
            { new: true }
        );

        if (!updatedDevice) {
            return res.status(404).json({ message: 'Dispositivo no encontrado' });
        }
        res.json(updatedDevice);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el dispositivo: ' + error.message });
    }
});

// Eliminar un dispositivo
router.delete('/devices/:id', async (req, res) => {
    try {
        const deletedDevice = await Device.findByIdAndDelete(req.params.id);
        if (!deletedDevice) {
            return res.status(404).json({ message: 'Dispositivo no encontrado' });
        }
        res.json({ message: 'Dispositivo eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el dispositivo: ' + error.message });
    }
});

// Exportar las rutas
module.exports = router;
