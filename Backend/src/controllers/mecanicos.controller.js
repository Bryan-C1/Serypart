const MecanicosModel = require('../models/mecanicos.model');

async function getAll(req, res, next) {
  try {
    res.json(await MecanicosModel.getAll());
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const row = await MecanicosModel.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await MecanicosModel.create(req.body));
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const row = await MecanicosModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = await MecanicosModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
