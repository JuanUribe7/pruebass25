// utils/websocketUtils.js

const WebSocket = require('ws');

const enviarNotificacion = (notificacion, wss) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(notificacion));
        }
    });
};

module.exports = { enviarNotificacion };
