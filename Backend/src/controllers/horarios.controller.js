const HorarioModel = require('../models/horarios.model');

async function getAll(req, res, next) {
  try {
    const rows = await HorarioModel.getAll();
    res.json(rows);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const row = await HorarioModel.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const row = await HorarioModel.create(req.body);
    res.status(201).json(row);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const row = await HorarioModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = await HorarioModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
