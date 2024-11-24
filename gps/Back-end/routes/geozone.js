
module.exports = mongoose.model('Geozone', geozoneSchema);
const express = require('express');
const router = express.Router();
const Geozone = require('./models/geozone'); // Asegúrate de que la ruta sea correcta

// Endpoint POST para guardar una geozona en la base de datos
router.post('/geozones', async (req, res) => {
  try {
    const geozone = new Geozone(req.body);
    await geozone.save();
    res.status(201).json(geozone);
  } catch (error) {
    console.error('Error al guardar la geozona:', error.message);
    res.status(500).json({ error: 'Error al guardar la geozona: ' + error.message });
  }
});

// Endpoint GET para buscar y enviar las geozonas desde la base de datos
router.get('/geozones', async (req, res) => {
  try {
    const geozones = await Geozone.find();
    res.status(200).json(geozones);
  } catch (error) {
    console.error('Error al obtener las geozonas:', error.message);
    res.status(500).json({ error: 'Error al obtener las geozonas: ' + error.message });
  }
});

module.exports = router;