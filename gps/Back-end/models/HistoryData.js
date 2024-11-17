// models/HistoryData.js
const mongoose = require('mongoose');

const historyDataSchema = new mongoose.Schema({
    imei: { type: String, required: true },
    fixTime: { type: Date, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    speed: { type: Number, required: false }
}, { minimize: false });

module.exports = mongoose.model('HistoryData', historyDataSchema);