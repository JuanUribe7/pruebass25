const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const { enviarNotificacion } = require('../server');
// Ruta para obtener todas las notificaciones
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener notificaciones', error: error.message });
    }
});

// Ruta para agregar una nueva notificación
router.post('/', async (req, res) => {
    const notification = new Notification(req.body);
    try {
        const savedNotification = await notification.save();
        
        // Enviar la notificación al cliente
        enviarNotificacion(savedNotification);

        res.status(201).json(savedNotification);
    } catch (error) {
        res.status(400).json({ message: 'Error al guardar notificación', error: error.message });
    }
});

// Ruta para eliminar todas las notificaciones
router.delete('/', async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.status(200).json({ message: 'Todas las notificaciones han sido eliminadas' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar notificaciones', error: error.message });
    }
});

module.exports = router;