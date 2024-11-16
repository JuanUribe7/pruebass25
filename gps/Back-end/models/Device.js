const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    deviceName: { type: String, required: false },
    responsible: { type: String, required: false },
    phoneNumber: { type: String, required: false },
}, { minimize: false });

const deviceStatusSchema = new mongoose.Schema({
    imei: { type: String, required: true, unique: true },
    fixTime: { type: Date, required: false },
    lat: { type: Number, required: false },
    lon: { type: Number, required: false },
    speed: { type: Number, required: false },
    course: { type: Number, required: false },
    ignition: { type: Boolean, required: false },
    charging: { type: Boolean, required: false },
    gpsTracking: { type: Boolean, required: false },
    relayState: { type: Boolean, required: false },
}, { minimize: false });

const historyDataSchema = new mongoose.Schema({
    imei: { type: String, required: true, unique: true },
    fixTime: { type: Date, required: false },
    lat: { type: Number, required: false },
    lon: { type: Number, required: false },
    speed: { type: Number, required: false },
}, { minimize: false });

module.exports = {
    Device: mongoose.model('Device', deviceSchema),
    DeviceStatus: mongoose.model('DeviceStatus', deviceStatusSchema),
    HistoryData: mongoose.model('HistoryData', historyDataSchema)

};