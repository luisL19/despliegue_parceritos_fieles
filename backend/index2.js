const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))

// Conexión a la base de datos usando un pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para ejecutar consultas de forma segura
async function executeQuery(query, params) {
  let connection;
  try {
    connection = await db.getConnection();
    const [results] = await connection.query(query, params);
    return results;
  } catch (error) {
    console.error('Error durante la consulta:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Ruta para obtener usuarios
app.get('/api/users', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM usuario');
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error.message);
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
});

// Ruta para crear un usuario
app.post('/api/register', async (req, res) => {
  const { Nombre, Apellido, Correo, Celular, Direccion, TipoDocumento, NumeroDocumento, Contraseña } = req.body;

  if (!Nombre || !Apellido || !Correo || !Celular || !Direccion || !TipoDocumento || !NumeroDocumento || !Contraseña) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await executeQuery('SELECT * FROM usuario WHERE correo = ?', [Correo]);

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario con este correo.' });
    }

    // Crear el nuevo usuario en la tabla 'usuario'
    const result = await executeQuery(`
      INSERT INTO usuario (nombre, apellido, correo, direccion, tipo_Documento, numero_Documento, celular, contraseña, rol) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Cliente')
    `, [Nombre, Apellido, Correo, Direccion, TipoDocumento, NumeroDocumento, Celular, Contraseña]);

    console.log('Usuario creado exitosamente con ID:', result.insertId);

    res.status(201).json({ message: 'Usuario registrado exitosamente como Cliente.' });
  } catch (error) {
    console.error('Error al crear el usuario:', error.message);
    res.status(500).json({ error: 'Error al crear el usuario.' });
  }
});

// Ruta de inicio de sesión
app.post('/api/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
  }

  try {
    const results = await executeQuery('SELECT * FROM usuario WHERE correo = ?', [correo]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const usuario = results[0];

    if (usuario.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      usuarioId: usuario.id_Usuario,
      nombre: usuario.nombre,
      rol: usuario.rol
    });
  } catch (error) {
    console.error('Error al verificar el usuario:', error.message);
    res.status(500).json({ error: 'Error al verificar el usuario.' });
  }
});

// Ruta para registrar una mascota y asociarla con un cliente
app.post('/registrar-mascota', async (req, res) => {
    const { nombre, raza, esterilizado, sexo, peso, edad, enfermedades, id_Usuario } = req.body;
  
    if (!nombre || !raza || !esterilizado || !sexo || !peso || !edad || !id_Usuario) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }
  
    try {
      // Buscar el id_Cliente usando el id_Usuario
      const clienteResult = await executeQuery('SELECT id_Cliente FROM cliente WHERE id_Usuario = ?', [id_Usuario]);
  
      if (clienteResult.length === 0) {
        return res.status(404).json({ error: 'No se encontró el cliente asociado a este usuario.' });
      }
  
      const id_Cliente = clienteResult[0].id_Cliente;
  
      // Inserta la mascota en la tabla `mascota`
      const mascotaResult = await executeQuery(
        'INSERT INTO mascotas (nombre, raza, esterilizado, sexo, peso, edad, enfermedades) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, raza, esterilizado, sexo, peso, edad, enfermedades]
      );
  
      const id_Mascota = mascotaResult.insertId;
  
      // Inserta la relación en la tabla `clientemascota` usando el id_Cliente obtenido
      await executeQuery(
        'INSERT INTO clientemascota (id_ClienteFK1, id_MascotaFK) VALUES (?, ?)',
        [id_Cliente, id_Mascota]
      );
  
      res.status(201).json({ message: 'Mascota y relación con cliente registradas exitosamente.' });
    } catch (error) {
      console.error('Error al registrar la mascota y su relación con el cliente:', error.message);
      res.status(500).json({ error: 'Error al registrar la mascota y su relación con el cliente.' });
    }
  });
  
  

// Ruta para obtener mascotas en el servicio de colegio confirmadas para la gestión de asistencia
app.get('/mascotas/colegio', async (req, res) => {
  const sql = `
    SELECT m.id_Mascota, m.nombre, c.tipo_servicio, u.direccion AS direccion_dueño, u.celular AS celular_dueño
    FROM clientemascota cm
    INNER JOIN mascotas m ON cm.id_MascotaFK = m.id_Mascota
    INNER JOIN cliente cl ON cm.id_ClienteFK1 = cl.id_Cliente
    INNER JOIN usuario u ON cl.id_Usuario = u.id_Usuario
    INNER JOIN colegio c ON c.id_MascotaFK = m.id_Mascota
    WHERE c.tipo_servicio = 'colegio' AND c.estado = 'Confirmado'
  `;

  try {
    const results = await executeQuery(sql);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener mascotas en el colegio para gestión de asistencia:', error.message);
    res.status(500).json({ error: 'Error al obtener mascotas en el colegio para gestión de asistencia.' });
  }
});


// Aplicar body-parser solo para JSON en POST y PUT


// Ruta para obtener reservas confirmadas de tipo "Hotel" o "Pasadía" en la fecha actual
app.get('/reservas/:tipoServicio', async (req, res) => {
  const { tipoServicio } = req.params;
  const today = new Date().toISOString().split('T')[0];

  const sql = `
    SELECT DISTINCT r.id_Reservas, r.fecha_Inicio, r.fecha_Fin, r.tipo_servicio, m.id_Mascota,
           u.nombre AS nombre_dueño, u.direccion AS direccion_cliente, u.celular AS celular_cliente,
           m.nombre AS nombre_mascota
    FROM reservas r
    INNER JOIN clienteReserva cr ON cr.id_ReservaFK1 = r.id_Reservas
    INNER JOIN cliente cl ON cr.id_ClienteFK3 = cl.id_Cliente
    INNER JOIN usuario u ON cl.id_Usuario = u.id_Usuario
    INNER JOIN mascotas m ON cr.id_MascotaFK = m.id_Mascota
    WHERE r.tipo_servicio = ? 
      AND r.estado = 'Confirmado' 
      AND ? BETWEEN r.fecha_Inicio AND IFNULL(r.fecha_Fin, r.fecha_Inicio)
  `;

  try {
    const results = await executeQuery(sql, [tipoServicio, today]);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener reservas confirmadas de hoy:', error.message);
    res.status(500).json({ error: 'Error al obtener reservas confirmadas de hoy.' });
  }
});



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// Ruta para consultar las mascotas de un cliente específico usando su userId
// Ruta para consultar las mascotas de un cliente específico usando su userId
app.post('/api/clientes/mascotas', async (req, res) => {
    const { userId } = req.body; // Obtener el userId desde el cuerpo de la solicitud
  
    if (!userId) {
      return res.status(400).json({ error: 'El ID del usuario es requerido.' });
    }
  
    try {
      console.log(`Buscando id_Cliente asociado al userId: ${userId}`);
  
      // Consulta para obtener el id_Cliente usando el id_Usuario
      const clienteResult = await executeQuery('SELECT id_Cliente FROM cliente WHERE id_Usuario = ?', [userId]);
  
      if (clienteResult.length === 0) {
        console.log(`No se encontró un id_Cliente asociado al userId ${userId}`);
        return res.status(404).json({ error: `No existe un cliente asociado al userId ${userId}.` });
      }
  
      const id_Cliente = clienteResult[0].id_Cliente;
      console.log(`Cliente encontrado con id_Cliente: ${id_Cliente} para el userId ${userId}`);
  
      // Consulta de mascotas asociadas al id_Cliente
      const mascotasResult = await executeQuery(`
        SELECT m.id_Mascota, m.nombre, m.raza, m.edad
        FROM clientemascota cm
        INNER JOIN mascotas m ON cm.id_MascotaFK = m.id_Mascota
        WHERE cm.id_ClienteFK1 = ?
      `, [id_Cliente]);
  
      if (mascotasResult.length === 0) {
        console.log(`No se encontraron mascotas asociadas al cliente con id_Cliente ${id_Cliente}`);
        return res.status(404).json({ error: 'No se encontraron mascotas para este cliente.' });
      }
  
      console.log(`Mascotas encontradas para el cliente ${id_Cliente}:`, mascotasResult);
      res.status(200).json(mascotasResult);
    } catch (error) {
      console.error('Error al consultar las mascotas del cliente:', error.message);
      res.status(500).json({ error: 'Error al consultar las mascotas del cliente.' });
    }
  });
  
  
// Endpoint para obtener la información de una mascota específica
app.post('/api/mascotas/perfil', async (req, res) => {
    const { id, userId } = req.body; // Recibir id de la mascota y userId en el cuerpo de la solicitud
  
    if (!id || !userId) {
      return res.status(400).json({ error: 'El ID de la mascota y el ID del usuario son requeridos.' });
    }
  
    try {
      console.log(`Buscando información de la mascota con id: ${id} para el usuario con id: ${userId}`);
  
      // Verificar que la mascota pertenece al cliente
      const mascotaResult = await executeQuery(`
        SELECT m.id_Mascota, m.nombre, m.raza, m.edad, m.peso, m.enfermedades, m.esterilizado 
        FROM mascotas m
        INNER JOIN clientemascota cm ON m.id_Mascota = cm.id_MascotaFK
        INNER JOIN cliente c ON cm.id_ClienteFK1 = c.id_Cliente
        WHERE m.id_Mascota = ? AND c.id_Usuario = ?`,
        [id, userId]);
  
      if (mascotaResult.length === 0) {
        console.log(`No se encontró la mascota con id ${id} para el usuario con id ${userId}`);
        return res.status(404).json({ error: 'No se encontró la mascota para este usuario.' });
      }
  
      res.status(200).json(mascotaResult[0]);
    } catch (error) {
      console.error('Error al consultar la mascota:', error.message);
      res.status(500).json({ error: 'Error al consultar la mascota.' });
    }
  });
  
  // Endpoint para eliminar una mascota específica
  app.post('/api/mascotas/eliminar', async (req, res) => {
    const { id, userId } = req.body;
  
    if (!id || !userId) {
      return res.status(400).json({ error: 'El ID de la mascota y el ID del usuario son requeridos.' });
    }
  
    try {
      console.log(`Intentando eliminar la mascota con id: ${id} para el usuario con id: ${userId}`);
  
      // Verificar que la mascota pertenece al cliente
      const verificaMascota = await executeQuery(`
        SELECT * FROM clientemascota cm
        INNER JOIN cliente c ON cm.id_ClienteFK1 = c.id_Cliente
        WHERE cm.id_MascotaFK = ? AND c.id_Usuario = ?`,
        [id, userId]);
  
      if (verificaMascota.length === 0) {
        console.log(`No se encontró la mascota con id ${id} para el usuario con id ${userId}`);
        return res.status(404).json({ error: 'No se encontró la mascota para este usuario.' });
      }
  
      // Eliminar la mascota
      await executeQuery('DELETE FROM mascotas WHERE id_Mascota = ?', [id]);
  
      res.status(200).json({ message: 'Mascota eliminada exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar la mascota:', error.message);
      res.status(500).json({ error: 'Error al eliminar la mascota.' });
    }
  });
  
  //Inscribir la mascota al colegio
  app.post('/api/servicios/inscribir-colegio', async (req, res) => {
    const { mascotaId, userId } = req.body;
  
    if (!mascotaId || !userId) {
      return res.status(400).json({ error: 'El ID de la mascota y el ID del usuario son requeridos.' });
    }
  
    try {
      // Verificar que la mascota pertenece al usuario
      const verificaMascota = await executeQuery(`
        SELECT * FROM clientemascota cm
        INNER JOIN cliente c ON cm.id_ClienteFK1 = c.id_Cliente
        WHERE cm.id_MascotaFK = ? AND c.id_Usuario = ?`,
        [mascotaId, userId]);
  
      if (verificaMascota.length === 0) {
        return res.status(404).json({ error: 'La mascota no pertenece a este usuario.' });
      }
  
      // Inscribir la mascota en el servicio de colegio
      await executeQuery('INSERT INTO colegio (id_MascotaFK, tipo_servicio, estado) VALUES (?, "colegio", "Pendiente")', [mascotaId]);
  
      res.status(200).json({ message: 'Mascota inscrita en el servicio de colegio exitosamente.' });
    } catch (error) {
      console.error('Error al inscribir la mascota en el servicio de colegio:', error.message);
      res.status(500).json({ error: 'Error al inscribir la mascota en el servicio de colegio.' });
    }
  });
  
  
// Endpoint para registrar una nueva reserva
app.post('/api/reservas', async (req, res) => {
  const { fechaInicio, fechaFinal, mascota, tipoServicio, usuarioId } = req.body;

  // Validación de campos requeridos
  if (!fechaInicio || !mascota || !tipoServicio || !usuarioId) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes.' });
  }
  if (tipoServicio === 'Hotel' && !fechaFinal) {
    return res.status(400).json({ error: 'La fecha final es obligatoria para el servicio de hotel.' });
  }

  try {
    // Obtener el id del cliente asociado al usuarioId
    const clienteResult = await executeQuery('SELECT id_Cliente FROM cliente WHERE id_Usuario = ?', [usuarioId]);

    if (clienteResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró el cliente asociado a este usuario.' });
    }

    const idCliente = clienteResult[0].id_Cliente;

    // Obtener el id de la mascota seleccionada y verificar que pertenece al cliente
    const mascotaResult = await executeQuery(`
      SELECT m.id_Mascota
      FROM mascotas m
      INNER JOIN clientemascota cm ON m.id_Mascota = cm.id_MascotaFK
      WHERE m.nombre = ? AND cm.id_ClienteFK1 = ?
    `, [mascota, idCliente]);

    if (mascotaResult.length === 0) {
      return res.status(404).json({ error: 'La mascota seleccionada no pertenece a este cliente.' });
    }

    const idMascota = mascotaResult[0].id_Mascota;

    // Crear la reserva en la tabla `reservas`
    const reservaResult = await executeQuery(`
      INSERT INTO reservas (fecha_Inicio, fecha_Fin, tipo_servicio, estado)
      VALUES (?, ?, ?, 'Por Confirmar')
    `, [fechaInicio, fechaFinal, tipoServicio]);

    const idReserva = reservaResult.insertId;

    // Registrar la relación en `clienteReserva` con `id_ClienteFK3`, `id_ReservaFK1`, y `id_MascotaFK`
    await executeQuery('INSERT INTO clienteReserva (id_ClienteFK3, id_ReservaFK1, id_MascotaFK) VALUES (?, ?, ?)', [idCliente, idReserva, idMascota]);

    res.status(201).json({ message: 'Reserva registrada exitosamente.' });
  } catch (error) {
    console.error('Error al registrar la reserva:', error.message);
    res.status(500).json({ error: 'Error al registrar la reserva.' });
  }
});





// Endpoint para obtener reservas de un cliente específico
app.get('/api/clientes/:userId/reservas', async (req, res) => {
  const { userId } = req.params;

  try {
    // Obtener el id_Cliente usando el userId
    const clienteResult = await executeQuery('SELECT id_Cliente FROM cliente WHERE id_Usuario = ?', [userId]);

    if (clienteResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró el cliente asociado a este usuario.' });
    }

    const idCliente = clienteResult[0].id_Cliente;

    // Consultar las reservas asociadas al cliente y sus mascotas
    const sql = `
      SELECT r.id_Reservas, r.fecha_Inicio, r.fecha_Fin, r.tipo_servicio, r.estado, m.nombre AS nombre_mascota
      FROM reservas r
      INNER JOIN clienteReserva cr ON r.id_Reservas = cr.id_ReservaFK1
      INNER JOIN mascotas m ON cr.id_MascotaFK = m.id_Mascota
      WHERE cr.id_ClienteFK3 = ?
    `;

    const reservas = await executeQuery(sql, [idCliente]);

    if (reservas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron reservas para este cliente.' });
    }

    res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al consultar las reservas del cliente:', error.message);
    res.status(500).json({ error: 'Error al consultar las reservas del cliente.' });
  }
});



// Ruta para registrar una queja y asociarla a un cliente
app.post('/api/quejas', async (req, res) => {
  const { contenido, usuarioId } = req.body;
  
  if (!contenido || !usuarioId) {
      return res.status(400).json({ error: 'El contenido de la queja y el ID del usuario son obligatorios.' });
  }

  const fecha = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD

  try {
      // Obtener el id del cliente usando el usuarioId
      const clienteResult = await executeQuery('SELECT id_Cliente FROM cliente WHERE id_Usuario = ?', [usuarioId]);

      if (clienteResult.length === 0) {
          return res.status(404).json({ error: 'No se encontró el cliente asociado a este usuario.' });
      }

      const idCliente = clienteResult[0].id_Cliente;

      // Insertar la queja en la tabla `quejas` con la fecha actual
      const quejaResult = await executeQuery('INSERT INTO quejas (contenido, fecha) VALUES (?, ?)', [contenido, fecha]);

      const idQueja = quejaResult.insertId;

      // Registrar la relación en `clientequeja`
      await executeQuery('INSERT INTO clientequeja (id_ClienteFK2, id_QuejaFK1) VALUES (?, ?)', [idCliente, idQueja]);

      res.status(201).json({ message: 'Queja registrada y asociada al cliente exitosamente.' });
  } catch (error) {
      console.error('Error al registrar la queja y la relación con el cliente:', error.message);
      res.status(500).json({ error: 'Error al registrar la queja y la relación con el cliente.' });
  }
});



// Ruta para obtener todas las quejas de un cliente específico
app.get('/api/clientes/:usuarioId/quejas', async (req, res) => {
  const { usuarioId } = req.params;

  try {
      const clienteResult = await executeQuery('SELECT id_Cliente FROM cliente WHERE id_Usuario = ?', [usuarioId]);

      if (clienteResult.length === 0) {
          return res.status(404).json({ error: 'No se encontró el cliente asociado a este usuario.' });
      }

      const idCliente = clienteResult[0].id_Cliente;

      // Consultar las quejas asociadas al cliente, incluyendo el id_Queja
      const quejas = await executeQuery(`
          SELECT q.id_Queja, q.fecha, q.contenido
          FROM quejas q
          INNER JOIN clientequeja cq ON q.id_Queja = cq.id_QuejaFK1
          WHERE cq.id_ClienteFK2 = ?
          ORDER BY fecha DESC
      `, [idCliente]);

      res.status(200).json(quejas);
  } catch (error) {
      console.error('Error al obtener las quejas del cliente:', error.message);
      res.status(500).json({ error: 'Error al obtener las quejas del cliente.' });
  }
});



// Endpoint para actualizar una queja específica
app.put('/api/quejas/:id_Queja', async (req, res) => {
  const { id_Queja } = req.params;
  const { contenido } = req.body;

  if (!contenido) {
    return res.status(400).json({ error: 'El contenido de la queja es obligatorio.' });
  }

  try {
    const result = await executeQuery(
      'UPDATE quejas SET contenido = ? WHERE id_Queja = ?',
      [contenido, id_Queja]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Queja no encontrada.' });
    }

    res.status(200).json({ message: 'Queja actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar la queja:', error.message);
    res.status(500).json({ error: 'Error al actualizar la queja.' });
  }
});



// Endpoint para obtener el perfil del usuario
app.get('/api/usuarios/:usuarioId/perfil', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    // Consulta para obtener los datos del usuario por su ID
    const userProfile = await executeQuery(
      'SELECT id_Usuario, nombre, apellido, correo, direccion, tipo_Documento, numero_Documento, celular, rol FROM usuario WHERE id_Usuario = ?',
      [usuarioId]
    );

    if (userProfile.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json(userProfile[0]); // Devuelve solo el primer resultado, que es el perfil del usuario
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener el perfil del usuario.' });
  }
});


// Endpoint para actualizar el perfil de un cliente
// Endpoint para obtener la información de un usuario específico
app.get('/api/usuarios/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await executeQuery(
      `SELECT nombre, apellido, correo, contraseña, celular, direccion, tipo_Documento, numero_Documento
       FROM usuario
       WHERE id_Usuario = ?`,
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener el perfil del usuario.' });
  }
});

// Endpoint para actualizar un usuario específico
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, contraseña, celular, direccion, tipo_Documento, numero_Documento } = req.body;

  console.log("Datos recibidos en el backend:", req.body); // Agrega este log

  try {
      const result = await executeQuery(`
          UPDATE usuario 
          SET nombre = ?, apellido = ?, correo = ?, contraseña = ?, celular = ?, direccion = ?, tipo_Documento = ?, numero_Documento = ?
          WHERE id_Usuario = ?
      `, [nombre, apellido, correo, contraseña, celular, direccion, tipo_Documento, numero_Documento, id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
  } catch (error) {
      console.error('Error al actualizar el usuario:', error.message);
      res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
});


// Endpoint para obtener todas las inscripciones pendientes en "colegio"
app.get('/api/colegio/pendientes', async (req, res) => {
  try {
    const results = await executeQuery(`
      SELECT s.id_Servicio, s.id_MascotaFK, m.nombre AS nombre_mascota, m.raza, m.edad,
             u.nombre AS nombre_dueño, u.celular AS contacto_dueño
      FROM colegio s
      INNER JOIN mascotas m ON s.id_MascotaFK = m.id_Mascota
      INNER JOIN clientemascota cm ON m.id_Mascota = cm.id_MascotaFK
      INNER JOIN cliente c ON cm.id_ClienteFK1 = c.id_Cliente
      INNER JOIN usuario u ON c.id_Usuario = u.id_Usuario
      WHERE s.tipo_servicio = 'colegio' AND s.estado = 'Pendiente'
    `);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener inscripciones pendientes en colegio:', error.message);
    res.status(500).json({ error: 'Error al obtener inscripciones pendientes en colegio.' });
  }
});


// Endpoint para confirmar una inscripción en "colegio"
app.post('/api/colegio/:id/confirmar', async (req, res) => {
  const { id } = req.params; // id corresponde al id_Servicio

  try {
    const result = await executeQuery(`
      UPDATE colegio 
      SET estado = 'Confirmado' 
      WHERE id_Servicio = ? AND estado = 'Pendiente'
    `, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada o ya confirmada.' });
    }

    res.status(200).json({ message: 'Inscripción confirmada exitosamente.' });
  } catch (error) {
    console.error('Error al confirmar la inscripción en colegio:', error.message);
    res.status(500).json({ error: 'Error al confirmar la inscripción en colegio.' });
  }
});

// Endpoint para rechazar una inscripción en "colegio"
app.post('/api/colegio/:id/rechazar', async (req, res) => {
  const { id } = req.params; // id corresponde al id_Servicio

  try {
    const result = await executeQuery(`
      UPDATE colegio 
      SET estado = 'Rechazado' 
      WHERE id_Servicio = ? AND estado = 'Pendiente'
    `, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada o ya procesada.' });
    }

    res.status(200).json({ message: 'Inscripción rechazada exitosamente.' });
  } catch (error) {
    console.error('Error al rechazar la inscripción en colegio:', error.message);
    res.status(500).json({ error: 'Error al rechazar la inscripción en colegio.' });
  }
});


//Asistencia 
app.post('/registrar-asistencias', async (req, res) => {
  console.log("Datos recibidos en el backend:", req.body); // Verifica la estructura de los datos

  const { asistencias } = req.body;

  if (!asistencias || !Array.isArray(asistencias)) {
    return res.status(400).json({ error: 'Formato de datos de asistencias incorrecto.' });
  }

  try {
    for (const asistencia of asistencias) {
      const { id_Mascota, tipo_servicio, asistio } = asistencia;

      if (!id_Mascota || !tipo_servicio || asistio === undefined) {
        console.log("Datos incompletos:", asistencia);
        return res.status(400).json({ error: 'Faltan datos requeridos para registrar la asistencia.' });
      }

      await executeQuery(`
        INSERT INTO asistencias (id_Mascota, tipo_servicio, fecha, asistio)
        VALUES (?, ?, CURDATE(), ?)
      `, [id_Mascota, tipo_servicio, asistio]);
    }

    res.status(201).json({ message: 'Asistencias registradas exitosamente.' });
  } catch (error) {
    console.error('Error al registrar asistencias:', error.message);
    res.status(500).json({ error: 'Error al registrar asistencias.' });
  }
});


// Endpoint para que el empleado consulte las mascotas
app.get('/api/empleados/consultar-mascotas', async (req, res) => {
  const sql = `
    SELECT 
      m.id_Mascota, 
      m.nombre AS nombre_mascota, 
      m.raza, 
      m.edad, 
      m.sexo, 
      m.peso, 
      c.id_Cliente, 
      u.nombre AS nombre_dueño, 
      u.direccion, 
      u.celular 
    FROM mascotas m
    INNER JOIN clientemascota cm ON m.id_Mascota = cm.id_MascotaFK
    INNER JOIN cliente c ON cm.id_ClienteFK1 = c.id_Cliente
    INNER JOIN usuario u ON c.id_Usuario = u.id_Usuario
  `;

  try {
    const results = await executeQuery(sql);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al consultar mascotas:', error.message);
    res.status(500).json({ error: 'Error al consultar mascotas.' });
  }
});


// Ruta para obtener los detalles de una mascota específica y su dueño
app.get('/api/empleados/mascotas/perfil/:id', async (req, res) => {
  const { id } = req.params;
  const sqlMascota = `
    SELECT m.id_Mascota, m.nombre AS nombre_mascota, m.raza, m.edad, m.peso, m.sexo, m.enfermedades, m.esterilizado,
           u.nombre AS nombre_dueño, u.direccion, u.celular, u.correo
    FROM mascotas m
    INNER JOIN clientemascota cm ON m.id_Mascota = cm.id_MascotaFK
    INNER JOIN cliente c ON cm.id_ClienteFK1 = c.id_Cliente
    INNER JOIN usuario u ON c.id_Usuario = u.id_Usuario
    WHERE m.id_Mascota = ?;
  `;

  try {
    const results = await executeQuery(sqlMascota, [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Mascota no encontrada.' });
    }

    const mascotaData = results[0];
    const mascota = {
      id_Mascota: mascotaData.id_Mascota,
      nombre: mascotaData.nombre_mascota,
      raza: mascotaData.raza,
      edad: mascotaData.edad,
      peso: mascotaData.peso,
      sexo: mascotaData.sexo,
      enfermedades: mascotaData.enfermedades,
      esterilizado: mascotaData.esterilizado
    };

    const dueno = {
      nombre: mascotaData.nombre_dueño,
      direccion: mascotaData.direccion,
      celular: mascotaData.celular,
      correo: mascotaData.correo
    };

    res.status(200).json({ mascota, dueno });
  } catch (error) {
    console.error('Error al obtener los detalles de la mascota y su dueño:', error.message);
    res.status(500).json({ error: 'Error al obtener los detalles de la mascota y su dueño.' });
  }
});


// Endpoint para obtener todas las reservas
app.get('/api/reservas', async (req, res) => {
  const sql = `
    SELECT r.id_Reservas, r.fecha_Inicio, r.fecha_Fin, r.tipo_servicio, r.estado,
           m.nombre AS nombre_mascota,
           u.nombre AS nombre_dueño, u.direccion, u.celular, u.correo
    FROM reservas r
    INNER JOIN clienteReserva cr ON cr.id_ReservaFK1 = r.id_Reservas
    INNER JOIN mascotas m ON cr.id_MascotaFK = m.id_Mascota
    INNER JOIN cliente cl ON cr.id_ClienteFK3 = cl.id_Cliente
    INNER JOIN usuario u ON cl.id_Usuario = u.id_Usuario
  `;

  try {
    const results = await executeQuery(sql);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener todas las reservas:', error.message);
    res.status(500).json({ error: 'Error al obtener todas las reservas.' });
  }
});


// Endpoint para actualizar el estado de una reserva
app.put('/api/reservas/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  // Validar que el estado sea "Confirmado" o "Cancelado"
  if (!['Confirmado', 'Cancelado'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido. Debe ser "Confirmado" o "Cancelado".' });
  }

  const sql = `
    UPDATE reservas
    SET estado = ?
    WHERE id_Reservas = ?
  `;

  try {
    const result = await executeQuery(sql, [estado, id]);
    
    // Verificar si la reserva fue encontrada y actualizada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada.' });
    }

    res.status(200).json({ message: `Reserva actualizada a estado ${estado} exitosamente.` });
  } catch (error) {
    console.error('Error al actualizar el estado de la reserva:', error.message);
    res.status(500).json({ error: 'Error al actualizar el estado de la reserva.' });
  }
});

