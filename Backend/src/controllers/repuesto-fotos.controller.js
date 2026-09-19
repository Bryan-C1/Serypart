const RepuestoFotoModel = require('../models/repuesto-fotos.model');

async function getAll(req, res, next) {
  try {
    const rows = await RepuestoFotoModel.getAll();
    res.json(rows);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const row = await RepuestoFotoModel.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const row = await RepuestoFotoModel.create(req.body);
    res.status(201).json(row);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const row = await RepuestoFotoModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = await RepuestoFotoModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
