const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    deviceName: { type: String, required: true },
    responsible: { type: String, required: true },
    imei: { type: String, required: true, unique: true },
    phoneNumber: { type: String },  // Agregado el campo phoneNumber
    status: { type: String, required: true },
    coordenadas: {
        latitud: { type: Number},
        longitud: { type: Number }
    },
    kilometraje: { type: Number, default: null },
    velocidad: { type: Number, default: null }
}, { minimize: false });

module.exports = mongoose.model('Device', deviceSchema);
