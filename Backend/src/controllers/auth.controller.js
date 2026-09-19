const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

function normalizePasswordHash(value) {
  if (Buffer.isBuffer(value)) return value.toString('utf8');
  if (typeof value === 'string') return value;
  if (value && Array.isArray(value.data)) return Buffer.from(value.data).toString('utf8');
  return null;
}

async function register(req, res, next) {
  try {
    const { nombre, apellido, email, contraseña, telefono, numero_documento, tipo_documento } = req.body;

    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ message: 'nombre, email y contraseña son obligatorios' });
    }

    const telefonoNormalizado = String(telefono || '').replace(/\D/g, '');
    if (!/^\d{10}$/.test(telefonoNormalizado)) {
      return res.status(400).json({ message: 'El teléfono debe tener exactamente 10 dígitos' });
    }

    const [existing] = await pool.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const [roleRows] = await pool.query(
      'SELECT id_rol FROM roles WHERE LOWER(nombre) IN (?, ?, ?, ?, ?) LIMIT 1',
      ['cliente', 'cliente web', 'usuario', 'usuario web', 'client']
    );
    const defaultRoleId = roleRows[0]?.id_rol ?? null;

    const [result] = await pool.query(
      `INSERT INTO usuarios
         (nombre, apellido, numero_documento, tipo_documento, fecha_registro, email, contraseña, telefono, estado, id_rol)
       VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?, 'activo', ?)`,
      [nombre, apellido || null, numero_documento || null, tipo_documento || null, email, hash, telefonoNormalizado, defaultRoleId]
    );

    res.status(201).json({ id_usuario: result.insertId, nombre, email });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, contraseña } = req.body;
    if (!email || !contraseña) {
      return res.status(400).json({ message: 'email y contraseña son obligatorios' });
    }

    const [rows] = await pool.query(
      `SELECT u.*, r.nombre AS rol_nombre, r.permisos AS rol_permisos
         FROM usuarios u
         LEFT JOIN roles r ON r.id_rol = u.id_rol
        WHERE u.email = ?`,
      [email]
    );
    const usuario = rows[0];
    if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' });

    const passwordHash = normalizePasswordHash(usuario.contraseña);
    if (!passwordHash) return res.status(401).json({ message: 'Credenciales inválidas' });

    const valido = await bcrypt.compare(String(contraseña), passwordHash);
    if (!valido) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, id_rol: usuario.id_rol, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    delete usuario.contraseña;
    usuario.rol = usuario.id_rol ? {
      id_rol: usuario.id_rol,
      nombre: usuario.rol_nombre,
      permisos: typeof usuario.rol_permisos === 'string' ? JSON.parse(usuario.rol_permisos) : (usuario.rol_permisos || {}),
    } : null;
    delete usuario.rol_nombre;
    delete usuario.rol_permisos;
    res.json({ token, usuario });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
