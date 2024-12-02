// Importación de módulos
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); 
const Transbank = require('transbank-sdk');
const { WebpayPlus } = Transbank;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');
const axios = require('axios');

// const appointmentRoutes = require('./routes/appointments');

// Definición de constantes y variables
const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key';
const router = express.Router();




const webpay = new WebpayPlus.Transaction();

// Configuración para el entorno de pruebas de Webpay

WebpayPlus.configureForTesting('597055555532', '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C');
const transaction = new WebpayPlus.Transaction();


// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
};

// Aplica CORS a todas las rutas

app.use(cors(corsOptions));

// Si deseas manejar las solicitudes OPTIONS (preflight) de manera explícita:
app.options('*', cors(corsOptions)); // Manejo de preflight para todas las rutas

// Middlewares generales
app.use(bodyParser.json()); // Manejo de JSON
app.use(express.urlencoded({ extended: true })); // Manejo de URL-encoded
// app.use('/appointments', appointmentRoutes);
const morgan = require('morgan');
app.use(morgan('dev')); // Logger para desarrollo
app.use(router);
// Generación del token JWT

const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.user_role,
    name: user.user_name
  };
  const secret = SECRET_KEY; 
  const options = { expiresIn: '1h' };  
  return jwt.sign(payload, secret, options);
};


//configuracion correo
const transporter = nodemailer.createTransport({
  service: 'gmail', // Cambia esto si usas otro proveedor de correo
  auth: {
    user: 'giovanni.pina.alvarado@gmail.com', // Tu correo electrónico
    pass: 'leir ygtk ymvu ufma' // Tu contraseña (o una contraseña de aplicación)
  }
});






// Ruta principal
app.get("/", (req, res) => {
    res.json({ message: "Bienvenido al backend de la aplicación" });
});


// Ejemplo de una ruta protegida (autenticación con JWT)
app.post('/some-protected-route', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  // Verificar el token JWT
  jwt.verify(token, process.env.JWT_SECRET || 'dlx-))2#wwspw++wyh5u(ymj5fxcrgz+n@0ifi#be$qc(z55!k', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    // Token válido, puedes procesar la solicitud
    res.status(200).json({ message: 'Token valid', user: decoded });
  });
});

// Middleware
app.use(express.json());

// Sirve archivos estáticos (como imágenes) desde la carpeta 'uploads'
app.use('/uploads', express.static('uploads'));




// Almacenamiento para las imágenes de servicios
const storageServicios = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads/img2'); // Carpeta para servicios
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const uploadServicios = multer({ storage: storageServicios });
// ------------ Configuración de multer para servicios ------------

// Almacenamiento para las imágenes de servicios
// Configuración de multer para noticias y actividades
const storageNotices = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads/img3'); // Carpeta para noticias y actividades
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const uploadNotice = multer({ storage: storageNotices });


// ------------ Configuración de multer para usuarios ------------
// Almacenamiento para las imágenes de usuario
const storageUsuarios = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads/img1'); // Carpeta para usuarios
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const uploadUsuarios = multer({ storage: storageUsuarios });

// Configuración de base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'nutria',
  database: 'andesk9',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// ------------ CRUD para Usuarios ------------

// Crear un nuevo usuario
app.post('/usuarios', uploadUsuarios.single('userImage'), async (req, res) => {
  const { userName, userEmail, userPhone, userPassword, userRole } = req.body;

  if (!userName || !userEmail || !userPhone || !userPassword || !userRole) {
    return res.status(400).json({ message: 'Faltan datos de usuario.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const userImagePath = req.file ? `uploads/img1/${req.file.filename}` : null;

    const sql = `INSERT INTO class_user (user_name, user_email, user_phone, user_password, user_role, user_image_path) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [userName, userEmail, userPhone, hashedPassword, userRole, userImagePath];

    db.execute(sql, values, (err, results) => {
      if (err) {
        console.error('Error al insertar el usuario:', err);
        return res.status(500).json({ message: 'Error al guardar el usuario.' });
      }

      res.status(201).json({
        message: 'Usuario creado con éxito',
        usuario: {
          id: results.insertId,
          userName,
          userEmail,
          userPhone,
          userRole,
          userImage: userImagePath,
        },
      });
    });
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM class_user'; 
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      return res.status(500).json({ message: 'Error al obtener los usuarios' });
    }

    res.status(200).json(results);
  });
});

// Obtener un usuario específico por id
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM class_user WHERE id_user = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el usuario:', err);
      return res.status(500).json({ message: 'Error al obtener el usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(results[0]);
  });
});

// Eliminar un usuario por id
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM class_user WHERE id_user = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err);
      return res.status(500).json({ message: 'Error al eliminar el usuario' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  });
});

// Actualizar un usuario por id
app.put('/usuarios/:id', uploadUsuarios.single('userImage'), async (req, res) => {
  const { id } = req.params;
  const { userName, userEmail, userPhone, userRole } = req.body;

  // Verifica si hay una nueva imagen
  let userImagePath = req.file ? `uploads/img1/${req.file.filename}` : null;

  // Si no se proporciona una nueva imagen, usa la existente
  if (!userImagePath) {
    const existingImageQuery = 'SELECT user_image_path FROM class_user WHERE id_user = ?';
    db.execute(existingImageQuery, [id], (err, results) => {
      if (err) {
        console.error('Error al obtener la imagen actual:', err);
        return res.status(500).json({ message: 'Error al obtener la imagen actual' });
      }
      if (results.length > 0) {
        userImagePath = results[0].user_image_path; // Usa la imagen existente
      }
    });
  }

  const query = `
      UPDATE class_user 
      SET user_name = ?, user_email = ?, user_phone = ?, user_role = ?, user_image_path = ?
      WHERE id_user = ?`;
  
  db.execute(query, [userName, userEmail, userPhone, userRole, userImagePath, id], (err, results) => {
    if (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario actualizado con éxito', userImagePath });
  });
});

// Crear un nuevo servicio
app.post('/services', uploadServicios.single('serviceImage'), (req, res) => {
  const { serviceName, serviceDescription, servicePrice, serviceDuration } = req.body;
  const serviceImagePath = req.file ? `uploads/img2/${req.file.filename}` : null;

  if (!serviceName || !serviceDescription || !servicePrice || !serviceDuration) {
    return res.status(400).json({ message: 'Faltan datos del servicio.' });
  }

  const sql = `INSERT INTO services (service_name, service_description, service_price, service_duration, service_image_path) VALUES (?, ?, ?, ?, ?)`;
  const values = [serviceName, serviceDescription, servicePrice, serviceDuration, serviceImagePath];

  db.execute(sql, values, (err, results) => {
    if (err) {
      console.error('Error al insertar el servicio:', err);
      return res.status(500).json({ message: 'Error al guardar el servicio.' });
    }

    res.status(201).json({
      message: 'Servicio creado con éxito',
      servicio: {
        id_service: results.insertId,
        serviceName,
        serviceDescription,
        servicePrice,
        serviceDuration,
        serviceImagePath,
      },
    });
  });
});

// Obtener todos los servicios
app.get('/services', (req, res) => {
  const query = 'SELECT * FROM services'; 
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los servicios:', err);
      return res.status(500).json({ message: 'Error al obtener los servicios' });
    }

    res.status(200).json(results);
  });
});

// Obtener un servicio específico por id
app.get('/services/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM services WHERE id_service = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el servicio:', err);
      return res.status(500).json({ message: 'Error al obtener el servicio' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.status(200).json(results[0]);
  });
});

// Eliminar un servicio por id
app.delete('/services/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM services WHERE id_service = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar el servicio:', err);
      return res.status(500).json({ message: 'Error al eliminar el servicio' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.status(200).json({ message: 'Servicio eliminado con éxito' });
  });
});

// Actualizar un servicio por id
app.put('/services/:id', uploadServicios.single('serviceImage'), (req, res) => {
  const { id } = req.params;
  const { serviceName, serviceDescription, servicePrice, serviceDuration } = req.body;
  let serviceImagePath = req.file ? `uploads/img2/${req.file.filename}` : null;

  // Si no se proporciona una nueva imagen, usa la existente
  if (!serviceImagePath) {
    const existingImageQuery = 'SELECT service_image_path FROM services WHERE id_service = ?';
    db.execute(existingImageQuery, [id], (err, results) => {
      if (err) {
        console.error('Error al obtener la imagen actual:', err);
        return res.status(500).json({ message: 'Error al obtener la imagen actual' });
      }
      if (results.length > 0) {
        serviceImagePath = results[0].service_image_path; // Usa la imagen existente
      }
    });
  }

  const query = `
      UPDATE services 
      SET service_name = ?, service_description = ?, service_price = ?, service_duration = ?, service_image_path = ?
      WHERE id_service = ?`;
  
  db.execute(query, [serviceName, serviceDescription, servicePrice, serviceDuration, serviceImagePath, id], (err, results) => {
    if (err) {
      console.error('Error al actualizar el servicio:', err);
      return res.status(500).json({ message: 'Error al actualizar el servicio' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.status(200).json({ message: 'Servicio actualizado con éxito' });
  });
});





//crud horas
app.post('/appointments/confirmappointment', async (req, res) => {
  const {
    id_user, service_id, address_appoin, full_address, date_appoin, service_price, status,
    duration_weeks, day_of_week, comuna, time_slot
  } = req.body;

  // Verificar si faltan datos
  if (!id_user || !service_id || !address_appoin || !full_address || !date_appoin || !service_price || 
      !status || !duration_weeks || !day_of_week || !comuna || !time_slot) {
    return res.status(400).json({
      success: false,
      error: 'Faltan datos necesarios para procesar la cita.'
    });
  }

  // Obtener el buy_order del sessionStorage (o del frontend si lo estás enviando)
  const buy_order = req.body.buy_order || sessionStorage.getItem("buyOrder");

  // Verificar si buy_order está presente
  if (!buy_order) {
    return res.status(400).json({
      success: false,
      error: 'Falta el buy_order para procesar la cita.'
    });
  }

  const query = `
    INSERT INTO appointments 
    (id_user, service_id, address_appoin, full_address, 
     date_appoin, service_price, status, duration_weeks, buy_order) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    id_user,
    service_id,
    address_appoin,
    full_address,
    date_appoin,
    service_price,
    status,
    duration_weeks,
    buy_order
  ];

  try {
    const [result] = await db.execute(query, values);
    res.status(201).json({
      success: true,
      appointment: { id_appoin: result.insertId },
    });
  } catch (error) {
    console.error('Error al guardar la cita:', error);
    res.status(500).json({ success: false, error: 'Error al guardar la cita en la base de datos.' });
  }
});

// Servidor escuchando en el puerto
app.listen(5001, () => {
  console.log('Servidor en puerto 5001');
});


app.get('/appointments/available-hours', (req, res) => {
  // Consultar todos los horarios disponibles en la base de datos
  const query = 'SELECT * FROM available_hours WHERE is_available = 1'; // Solo los horarios disponibles
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los horarios:', err);
      return res.status(500).json({ message: 'Error al obtener los horarios' });
    }
    res.status(200).json(results); // Devolver los resultados (horarios)
  });
});

app.get('/appointments/select-appointment', (req, res) => {
  // Realizar la consulta SQL para obtener los horarios disponibles por día, comuna y hora
  const query = `
      SELECT day_of_week, comuna, time_slot
      FROM available_hours
      WHERE is_available = 1
      ORDER BY day_of_week, comuna, time_slot
  `;

  db.execute(query, (err, results) => {
      if (err) {
          console.error('Error al obtener los horarios:', err);
          return res.status(500).json({ message: 'Error al obtener los horarios' });
      }

      // Organizar los datos en un formato adecuado para el frontend (por día -> comuna -> horarios)
      const availableHours = {};

      results.forEach((row) => {
          if (!availableHours[row.day_of_week]) {
              availableHours[row.day_of_week] = {};
          }
          if (!availableHours[row.day_of_week][row.comuna]) {
              availableHours[row.day_of_week][row.comuna] = [];
          }
          availableHours[row.day_of_week][row.comuna].push(row.time_slot);
      });

      // Enviar los horarios estructurados como respuesta
      res.status(200).json(availableHours);
  });
});



app.delete('/appointments/delete-available-hour/:id', (req, res) => {
  const { id } = req.params; // El ID del horario que se quiere eliminar

  // Validar si el ID existe
  if (!id) {
    return res.status(400).json({ message: 'ID no proporcionado' });
  }

  // Eliminar el horario de la base de datos
  const query = 'DELETE FROM available_hours WHERE id_available_hour = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar el horario:', err);
      return res.status(500).json({ message: 'Error al eliminar el horario' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }
    res.status(200).json({ message: 'Horario eliminado correctamente' });
  });
});


app.post('/create-available-hour', (req, res) => {
  const { day_of_week, comuna, time_slot, is_available } = req.body;

  if (!day_of_week || !comuna || !time_slot) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Consulta SQL para insertar los datos en la tabla
  const sql = `
    INSERT INTO available_hours (day_of_week, comuna, time_slot, is_available) 
    VALUES (?, ?, ?, ?)
  `;
  const values = [day_of_week, comuna, time_slot, is_available];

  // Ejecutar la consulta
  db.execute(sql, values, (error, results) => {
      if (error) {
          console.error('Error al insertar horario disponible:', error);
          return res.status(500).json({ message: 'Error al crear el horario.' });
      }

      // Responder con éxito si la inserción fue exitosa
      res.status(201).json({ 
        message: 'Horario creado exitosamente', 
        data: { id_available_hour: results.insertId, day_of_week, comuna, time_slot, is_available }
      });
  });
});



//cupon
// Ruta para crear un cupón
app.post('/create-coupon', (req, res) => {
  const { code_coupon, discount_percent, status } = req.body;

  if (!code_coupon || !discount_percent || status === undefined) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const sql = `INSERT INTO coupon (code_coupon, discount_percent, status) VALUES (?, ?, ?)`;
  const values = [code_coupon, discount_percent, status];

  db.execute(sql, values, (err, result) => {
      if (err) {
          console.error('Error al crear el cupón:', err);
          return res.status(500).json({ message: 'Error al crear el cupón' });
      }
      res.status(201).json({ message: 'Cupón creado exitosamente', id: result.insertId });
  });
});

// Obtener todos los cupones
app.get('/coupons', (req, res) => {
  const sql = 'SELECT * FROM coupon';
  db.execute(sql, (err, results) => {
      if (err) {
          console.error('Error al obtener cupones:', err);
          return res.status(500).json({ message: 'Error al obtener cupones' });
      }
      res.status(200).json(results);
  });
});

// Actualizar el estado de un cupón
app.put('/coupons/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = 'UPDATE coupon SET status = ? WHERE id_coupon = ?';
  db.execute(sql, [status, id], (err, result) => {
      if (err) {
          console.error('Error al actualizar el estado del cupón:', err);
          return res.status(500).json({ message: 'Error al actualizar el estado' });
      }
      res.status(200).json({ message: 'Estado del cupón actualizado' });
  });
});

// Eliminar un cupón
app.delete('/coupons/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM coupon WHERE id_coupon = ?';
  db.execute(sql, [id], (err, result) => {
      if (err) {
          console.error('Error al eliminar el cupón:', err);
          return res.status(500).json({ message: 'Error al eliminar el cupón' });
      }
      res.status(200).json({ message: 'Cupón eliminado' });
  });
});
// Usar un cupón
app.post('/apply-coupon', (req, res) => {
  const { code_coupon } = req.body;

  db.execute(
      'SELECT * FROM coupon WHERE code_coupon = ? AND status = ?',
      [code_coupon, 'active'],
      (err, results) => {
          if (err) {
              console.error('Error al buscar el cupón:', err);
              return res.status(500).json({ success: false, message: 'Error al verificar el cupón.' });
          }

          if (results.length === 0) {
              return res.status(404).json({ success: false, message: 'Cupón no encontrado o inactivo.' });
          }

          const coupon = results[0];
          res.status(200).json({ success: true, discount_percent: coupon.discount_percent });
      }
  );
});



app.post('/api/discount/validate', async (req, res) => {
  const { code } = req.body;

  try {
      const [coupon] = await db.execute('SELECT discount_percent, status FROM coupon WHERE code_coupon = ?', [code_coupon]);

      if (coupon && coupon.status === 'activo') {
          res.json({ isValid: true, discountPercent: coupon.discount_percent });
      } else {
          res.json({ isValid: false });
      }
  } catch (error) {
      console.error('Error en la validación del cupón:', error);
      res.status(500).json({ isValid: false });
  }
});

//webpay
// Iniciar una transacción de pago
const createTransaction = async (amount, sessionId, buyOrder, returnUrl) => {
  try {
    const transaction = new WebpayPlus.Transaction();
    const response = await transaction.create(buyOrder, sessionId, amount, returnUrl);

    console.log("Transacción creada exitosamente:", response);
    return response;
  } catch (error) {
    console.error("Error al crear la transacción:", error);
    throw new Error("Error al crear la transacción: " + error.message);
  }
};

app.post('/api/payments/confirm', async (req, res) => {
  const { token, appointmentId } = req.body;

  if (!token || !appointmentId) {
    return res.status(400).json({ success: false, error: "Faltan datos necesarios para verificar el pago." });
  }

  try {
    const result = await commitTransaction(token); // Función que maneja la confirmación con Webpay

    if (result.status === 'AUTHORIZED') {
      // Actualiza el estado de la cita en tu base de datos
      await updateAppointmentStatus(appointmentId, 'Pagado');
      res.json({
        success: true,
        message: 'Pago aprobado y estado actualizado.',
        transaction: result,
      });
    } else {
      res.status(400).json({
        success: false,
        error: `Pago no aprobado: ${result.statusDetail || 'Motivo desconocido'}`,
      });
    }
  } catch (error) {
    console.error("Error al verificar el pago:", error.message);
    res.status(500).json({
      success: false,
      error: "Hubo un error al verificar el pago.",
      details: error.message,
    });
  }
});

// Endpoint para iniciar la transacción con Webpay
app.post('/initiate-payment', async (req, res) => {
  const { amount, appointmentId } = req.body;

  if (!amount || !appointmentId) {
    return res.status(400).json({ success: false, error: "Datos incompletos" });
  }

  const sessionId = `session-${appointmentId}`;
  const buyOrder = `order-${appointmentId}`;
  const returnUrl = "http://localhost:3000/payment-result"; // URL para la respuesta de Webpay

  try {
    // Crear la transacción con Webpay
    const response = await transaction.create(buyOrder, sessionId, amount, returnUrl);

    console.log("Transacción creada exitosamente:", response);

    // Devuelve la URL de pago y el token para redirigir al cliente
    res.json({
      success: true,
      paymentUrl: `${response.url}?token_ws=${response.token}`,
      buyOrder,
    });
  } catch (error) {
    console.error("Error al iniciar la transacción:", error);
    res.status(500).json({ success: false, error: "Error al iniciar la transacción de pago." });
  }
});

const commitTransaction = async (token, retries = 5, delay = 5000) => { // Incrementa a 5 segundos
  const transaction = new WebpayPlus.Transaction();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Intentando confirmar transacción (Intento ${attempt}/${retries})`);
      const result = await transaction.commit(token);
      console.log('Transacción confirmada exitosamente:', result);
      return result;
    } catch (error) {
      const isLockedError =
        error.response?.status === 422 &&
        error.message.includes('Transaction already locked by another process');

      if (isLockedError && attempt < retries) {
        console.warn(`Intento ${attempt}: Transacción bloqueada. Reintentando en ${delay} ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error('Error al confirmar la transacción: ' + error.message);
      }
    }
  }

  throw new Error('Transacción bloqueada tras múltiples intentos');
};


app.post('/verify-payment', async (req, res) => {
  const { token, appointmentId } = req.body; // Agregar appointmentId si es necesario

  if (!token || !appointmentId) {
    return res.status(400).json({ success: false, error: "Faltan datos necesarios para verificar el pago." });
  }

  try {
    const result = await commitTransaction(token);

    if (result.status === 'AUTHORIZED') {
      await updateAppointmentStatus(appointmentId, 'Pagado');
      res.json({
        success: true,
        message: 'Pago aprobado y estado actualizado.',
        transaction: result,
      });
    } else {
      res.status(400).json({
        success: false,
        error: `Pago no aprobado: ${result.statusDetail || 'Motivo desconocido'}`,
      });
    }
  } catch (error) {
    console.error("Error al verificar el pago:", error.message);
    res.status(500).json({
      success: false,
      error: "Hubo un error al verificar el pago.",
      details: error.message,
    });
  }
});



// Configuración del entorno


const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`Fecha inválida: ${dateString}`);
    }
    return date.toISOString().slice(0, 19).replace('T', ' ');
  } catch (error) {
    console.error("Error al formatear la fecha:", error.message);
    return null; // Devuelve null si la fecha es inválida
  }
};

// Función para confirmar el estado de la transacción


// Ruta para iniciar el pago (crear transacción)
router.post('/api/pay/start', async (req, res) => {
  const { amount, serviceId, userId } = req.body;

  try {
    const buyOrder = `order-${Math.floor(Math.random() * 1000000)}`;
    const sessionId = `session-${userId}-${serviceId}`;
    const returnUrl = `http://localhost:5000/api/pay/confirm`;

    const response = await createTransaction(amount, sessionId, buyOrder, returnUrl);

    res.json({
      success: true,
      paymentUrl: response.url,
      token: response.token,
    });
  } catch (error) {
    console.error('Error al iniciar transacción:', error);
    res.status(500).json({ error: 'Error al iniciar la transacción' });
  }
});

//579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C

// Ruta para recibir el resultado del pago (verificar estado final)
// Función para verificar el estado de la transacción
const verifyTransactionStatus = async (token) => {
  const transaction = new WebpayPlus.Transaction();
  try {
    const result = await transaction.commit(token); // Usar commit para confirmar
    console.log("Resultado de la confirmación:", result);
    return result;
  } catch (error) {
    console.error("Error al confirmar la transacción:", error);
    throw new Error("Error al confirmar la transacción: " + error.message);
  }
};

const updateAppointmentStatus = async (buyOrder, status) => {
  try {
    const query = `
      UPDATE appointments
      SET status = ?
      WHERE buy_order = ?
    `;
    const result = await db.execute(query, [status, buyOrder]);

    console.log("Resultado de la consulta:", result);

    if (result[0]?.affectedRows === 0) {
      throw new Error(`No se encontró ninguna cita con el buy_order: ${buyOrder}`);
    }

    console.log(`Estado de la cita ${buyOrder} actualizado a ${status}`);
    return result[0];
  } catch (error) {
    console.error('Error al actualizar el estado de la cita:', error);
    throw new Error('Error al actualizar el estado de la cita.');
  }
};



// Ruta para confirmar el pago
router.get('/api/pay/confirm', async (req, res) => {
  const { token_ws } = req.query;

  if (!token_ws) {
    console.error('Falta el token_ws en la consulta.');
    return res.redirect('/payment-failed'); // Redirige al fallo si falta el token
  }

  try {
    const result = await commitTransaction(token_ws);

    if (result.status === 'AUTHORIZED') {
      await updateAppointmentStatus(result.buyOrder, 'Pagado');
      console.log('Pago confirmado y estado actualizado:', result);
      res.redirect('/payment-success'); // Redirige a la página de éxito
    } else {
      console.warn('Pago no autorizado:', result);
      res.redirect('/payment-failed'); // Redirige a la página de fallo
    }
  } catch (error) {
    console.error('Error en la confirmación de pago:', error.message);
    res.redirect('/payment-failed');
  }
});

const processedTokens = new Set();

app.post('/payment-result', async (req, res) => {
  const {
    token,
    buyOrder,
    id_user,
    service_id,
    address_appoin,
    full_address,
    date_appoin,
    service_price,
    duration_weeks,
    day_of_week,
    comuna,
    time_slot,
  } = req.body;

  console.log('Datos recibidos para procesar el pago:', req.body);

  // Verificar datos obligatorios
  if (
    !token ||
    !buyOrder ||
    !id_user ||
    !service_id ||
    !address_appoin ||
    !full_address ||
    !date_appoin ||
    !service_price ||
    !duration_weeks ||
    !day_of_week ||
    !comuna ||
    !time_slot
  ) {
    return res.status(400).json({ error: 'Faltan datos necesarios para procesar el pago.' });
  }

  // Iniciar transacción para mantener consistencia entre las operaciones
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const result = await commitTransaction(token);

    if (result.status === 'AUTHORIZED') {
      // Preparar datos para la cita
      const appointmentData = {
        id_user,
        service_id,
        address_appoin,
        full_address,
        date_appoin,
        service_price,
        status: 'Pagado',
        duration_weeks,
      };

      const insertAppointmentQuery = `
        INSERT INTO appointments (id_user, service_id, address_appoin, full_address, date_appoin, service_price, status, duration_weeks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const appointmentValues = [
        appointmentData.id_user,
        appointmentData.service_id,
        appointmentData.address_appoin,
        appointmentData.full_address,
        appointmentData.date_appoin,
        appointmentData.service_price,
        appointmentData.status,
        appointmentData.duration_weeks,
      ];

      const [insertResult] = await connection.execute(insertAppointmentQuery, appointmentValues);
      console.log('Cita guardada con éxito:', insertResult);

      // Actualizar disponibilidad del horario
      const updateAvailableHoursQuery = `
        UPDATE available_hours
        SET is_available = 2
        WHERE day_of_week = ? AND comuna = ? AND time_slot = ? AND is_available = 1
      `;
      const updateValues = [day_of_week, comuna, time_slot];
      const [updateResult] = await connection.execute(updateAvailableHoursQuery, updateValues);
      console.log('Horario actualizado con éxito:', updateResult);

      // Confirmar la transacción SQL
      await connection.commit();

      return res.json({
        success: true,
        message: 'Pago aprobado. Tu cita ha sido confirmada.',
        transaction: result,
      });
    } else {
      console.warn('Pago no autorizado:', result);
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Pago rechazado: ${result.statusDetail || 'Motivo desconocido'}`,
      });
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error.message);
    await connection.rollback();

    if (error.message.includes('ER_DUP_ENTRY')) {
      return res.status(409).json({
        error: 'Conflicto con la base de datos. La cita podría ya estar registrada.',
      });
    }

    return res.status(500).json({
      error: 'Hubo un error al procesar el resultado del pago.',
      details: error.message,
    });
  } finally {
    connection.release();
  }
});








// Función para verificar el estado del pago

module.exports = router;

//login

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Se requieren correo y contraseña' });
  }

  const query = 'SELECT * FROM class_user WHERE user_email = ?';
  db.execute(query, [email], async (err, results) => {
    if (err) {
      console.error('Error al obtener el usuario:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = results[0];

    try {
      const match = await bcrypt.compare(password, user.user_password);
      if (!match) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      // Generar el token JWT
      const token = generateToken(user);

      // Responder con los datos necesarios
      return res.json({
        token,
        id: user.id_user,
        name: user.user_name,
        role: user.user_role,
      });
    } catch (error) {
      console.error('Error al comparar contraseñas:', error);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  });
});


// autenticacion
const verifyRole = (allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role; 

  if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Acceso denegado.' });
  }
  next();
};

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Asumiendo que el token se pasa en el header Authorization

  if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  jwt.verify(token, 'mi_clave_secreta', (err, decoded) => {
      if (err) {
          return res.status(403).json({ message: 'Token inválido' });
      }
      req.user = decoded; // Guarda la información decodificada del token en el request
      next(); // Llama a la siguiente función de middleware
  });
};

// Usar en rutas protegidas
app.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso autorizado', user: req.user });
});

// rutas
app.get('/admin', verifyRole(['entrenador','admin','cliente']), (req, res) => {
  res.send('Contenido solo para Administradores');
});

app.get('/trainer', verifyRole(['entrenador']), (req, res) => {
  res.send('Contenido para Entrenadores');
});

app.get('/cliente', verifyRole(['cliente']), (req, res) => {
  res.send('Contenido para Clientes');
});


// Obtener todas las noticias
app.get('/notices', (req, res) => {
  const sql = 'SELECT * FROM notice';

  db.execute(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener las noticias o actividades:', err);
      return res.status(500).json({ message: 'Error al obtener las noticias o actividades.' });
    }

    res.status(200).json(results); // Devuelve las noticias o actividades en formato JSON
  });
});



app.get('/notice/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM notice WHERE id_notice = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Noticia no encontrada', err);
      return res.status(500).json({ message: 'Noticia no encontrada' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Error al obtener la noticia' });
    }

    res.status(200).json(results[0]);
  });
});




app.get('/notices/:type', (req, res) => {
  const { type } = req.params; // 'noticia' o 'actividad'
  
  // Validar que el tipo sea 'noticia' o 'actividad'
  if (type !== 'noticia' && type !== 'actividad') {
    return res.status(400).json({ message: 'Tipo inválido. Usa "noticia" o "actividad".' });
  }

  const sql = 'SELECT * FROM notice WHERE tipe_notice = ?';

  db.execute(sql, [type], (err, results) => {
    if (err) {
      console.error('Error al obtener las noticias o actividades:', err);
      return res.status(500).json({ message: 'Error al obtener las noticias o actividades.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: `No se encontraron ${type}s.` });
    }

    res.status(200).json(results); // Devuelve las noticias o actividades en formato JSON
  });
});

//3 ultimas noticias

app.get('/lastnotices', (req, res) => {
  const sql = 'SELECT * FROM notice ORDER BY id_notice DESC LIMIT 3';

  db.execute(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener las noticias o actividades:', err);
      return res.status(500).json({ message: 'Error al obtener las noticias o actividades.' });
    }

    res.status(200).json(results); 
  });
});

// Crear una nueva noticia
app.post('/notice', uploadNotice.single('noticeImage'), (req, res) => {
  const { tipe_notice, name_notice, desct_notice, id_user } = req.body;
  const noticeImagePath = req.file ? `uploads/img3/${req.file.filename}` : null;

  if (!tipe_notice || !name_notice || !desct_notice || !id_user) {
    return res.status(400).json({ message: 'Faltan datos de la noticia o actividad.' });
  }

  const sql = `
    INSERT INTO notice (tipe_notice, name_notice, desct_notice, notice_image_path, id_user)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [tipe_notice, name_notice, desct_notice, noticeImagePath, id_user];

  db.execute(sql, values, (err, results) => {
    if (err) {
      console.error('Error al guardar la noticia o actividad:', err);
      return res.status(500).json({ message: 'Error al guardar la noticia o actividad.' });
    }

    res.status(201).json({
      message: 'Noticia o actividad creada con éxito',
      notice: {
        id_notice: results.insertId,
        tipe_notice,
        name_notice,
        desct_notice,
        noticeImagePath,
        id_user,
      },
    });
  });
});


// Actualizar una noticia

app.put('/notice/:id', uploadNotice.single('noticeImage'), async (req, res) => {
  const { id } = req.params;
  const { tipe_notice, name_notice, desct_notice, id_user } = req.body;

  try {
    // Verifica si la noticia o actividad existe
    const [existing] = await db.execute('SELECT notice_image_path FROM notice WHERE id_notice = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Noticia o actividad no encontrada.' });
    }

    let noticeImagePath = req.file ? `uploads/img3/${req.file.filename}` : existing[0]?.notice_image_path;

    // Si se sube una nueva imagen, elimina la anterior del sistema de archivos
    if (req.file && existing[0]?.notice_image_path) {
      const previousImagePath = path.join(__dirname, existing[0].notice_image_path);
      if (fs.existsSync(previousImagePath)) {
        fs.unlinkSync(previousImagePath);
      }
    }

    // Actualiza los datos en la base de datos
    const sql = `
      UPDATE notice 
      SET tipe_notice = ?, name_notice = ?, desct_notice = ?, notice_image_path = ?, id_user = ?
      WHERE id_notice = ?
    `;
    const values = [tipe_notice, name_notice, desct_notice, noticeImagePath, id_user, id];

    await db.execute(sql, values);

    res.status(200).json({
      message: 'Noticia o actividad actualizada con éxito',
      updatedNotice: {
        id_notice: id,
        tipe_notice,
        name_notice,
        desct_notice,
        noticeImagePath,
        id_user,
      },
    });
  } catch (error) {
    console.error('Error al actualizar la noticia o actividad:', error);
    res.status(500).json({ message: 'Error al actualizar la noticia o actividad.' });
  }
});


// Eliminar una noticia
router.delete('/notice/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminar noticia de la base de datos
    const query = 'DELETE FROM notice WHERE id_notice = ?';
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Noticia o actividad no encontrada.' });
    }

    res.status(200).json({ message: 'Noticia o actividad eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la noticia o actividad:', error);
    res.status(500).json({ message: 'Error al eliminar la noticia o actividad.' });
  }
});




//correo
app.post('/send-email', async (req, res) => {
  const { name, email, message, tel } = req.body;

  const mailOptions = {
    from: 'giovanni.pina.alvarado@gmail.com', // El correo desde el que se envía
    to: 'vanni.p.alvarado@gmail.com', // El correo al que se envía
    subject: 'Nuevo mensaje del formulario de contacto',
    text: `
      Nombre: ${name}
      Email: ${email}
      Teléfono: ${tel}
      Mensaje: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado con éxito.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo.' });
  }
});




// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
