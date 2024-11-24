const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    imei: { type: String, required: true },
    notificationName: { type: String, required: true },
    notificationTime: { type: String, required: true },
    notificationType: { type: String, required: true } // Nuevo campo para el tipo de notificación
}, { minimize: false });

module.exports = mongoose.model('notification', notificationSchema);