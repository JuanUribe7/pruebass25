// models/HistoryData.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const historyDataSchema = new mongoose.Schema({
    imei: { type: String, required: true },
    fixTime: { type: Date, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    speed: { type: Number, required: false }
}, { minimize: false });

// Añadir el campo auto-incremental
historyDataSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 1 });

module.exports = mongoose.model('HistoryData', historyDataSchema);