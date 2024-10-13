// routes/auth.js
const express = require('express');
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`); // Verifica que recibas los datos correctamente

  try {
    const user = await User.findOne({ email });
    console.log(user); // Verifica si el usuario se encuentra
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    return res.json({ message: 'Login exitoso' });
  } catch (err) {
    console.error(err); // Muestra el error en la consola
    return res.status(500).json({ message: 'Error del servidor' });
  }
});


module.exports = router;
