const UsuarioModel = require('../models/usuarios.model');

function ocultarCampos(row) {
  if (!row) return row;
  const clean = { ...row };
  delete clean.contraseña;
  return clean;
}

async function getAll(req, res, next) {
  try {
    const rows = await UsuarioModel.getAll();
    res.json(rows.map(ocultarCampos));
  } catch (err) { next(err); }
}

async function getClientes(req, res, next) {
  try {
    const rows = await UsuarioModel.getClientes();
    res.json(rows.map(ocultarCampos));
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const row = await UsuarioModel.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(ocultarCampos(row));
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const row = await UsuarioModel.create(req.body);
    res.status(201).json(ocultarCampos(row));
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const row = await UsuarioModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(ocultarCampos(row));
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = await UsuarioModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAll, getClientes, getById, create, update, remove };
