let imeis = new Map();

function getImei(deviceId) {
    return imeis.get(deviceId);
}

function setImei(deviceId, nuevoImei) {
    imeis.set(deviceId, nuevoImei);
}

module.exports = { getImei, setImei };
