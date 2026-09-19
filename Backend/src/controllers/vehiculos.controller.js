const pool = require('../config/db');
const VehiculoModel = require('../models/vehiculos.model');

async function isClientRole(user) {
  if (!user || !user.id_rol) return false;
  const [rows] = await pool.query('SELECT nombre FROM roles WHERE id_rol = ?', [user.id_rol]);
  const nombre = (rows[0]?.nombre || '').toLowerCase();
  return ['cliente', 'client', 'usuario', 'usuario web', 'cliente web'].includes(nombre);
}

async function getAll(req, res, next) {
  try {
    const rows = await VehiculoModel.getAll();
    if (await isClientRole(req.user)) {
      const filtered = rows.filter((row) => String(row.id_usuario) === String(req.user.id_usuario));
      return res.json(filtered);
    }
    res.json(rows);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const row = await VehiculoModel.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const row = await VehiculoModel.create(req.body);
    res.status(201).json(row);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const row = await VehiculoModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = await VehiculoModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
