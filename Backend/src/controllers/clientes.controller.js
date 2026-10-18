const ClienteModel = require('../models/clientes.model');

async function getAll(req, res, next) {
  try {
    res.json(await ClienteModel.getAll());
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const row = await ClienteModel.create(req.body);
    res.status(201).json(row);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const row = await ClienteModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

module.exports = { getAll, create, update };
