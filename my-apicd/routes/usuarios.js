const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir); // Guardar archivos en la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Agregar un timestamp al nombre del archivo
  },
});

const upload = multer({ storage });

router.post('/', upload.single('userImage'), (req, res) => {
  const { userName, userEmail, userPhone, userPassword, userRole } = req.body;

  // Imprimir los datos recibidos
  console.log('Datos recibidos:', { userName, userEmail, userPhone, userPassword, userRole });

  const user = {
    userName,
    userEmail,
    userPhone,
    userPassword,
    userRole,
    userImage: req.file ? req.file.path : null, // Guardar la ruta de la imagen
  };

  // Guardar el usuario en el archivo o en la base de datos
  fs.readFile('usuarios.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer usuarios:', err);
      return res.status(500).json({ message: 'Error al leer usuarios' });
    }

    const users = JSON.parse(data || '[]');
    users.push(user); // Agregar nuevo usuario

    // Guardar los usuarios actualizados
    fs.writeFile('usuarios.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Error al guardar usuarios:', err);
        return res.status(500).json({ message: 'Error al guardar usuario' });
      }
      res.status(201).json({ message: 'Usuario creado con éxito', user });
    });
  });
});

module.exports = router;