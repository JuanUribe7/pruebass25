const deviceSchema = new mongoose.Schema({
    deviceName: {
        type: String,
        required: true,
        trim: true
    },
    responsible: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: 'Desconectado',
        enum: ['Conectado', 'Desconectado', 'En espera']
    },
    imei: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    coordinates: {
        type: [Number],
        index: '2dsphere',
        sparse: true
    },
    lastConnection: {
        type: Date,
        default: Date.now
    }
});
