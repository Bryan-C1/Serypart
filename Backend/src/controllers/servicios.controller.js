const ServicioModel = require('../models/servicios.model');
const { uploadServicioImage } = require('../services/cloudinary.service');

async function getAll(req, res, next) {
  try {
    const rows = await ServicioModel.getAll();
    res.json(rows);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const row = await ServicioModel.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.file) data.foto = await uploadServicioImage(req.file);
    const row = await ServicioModel.create(data);
    res.status(201).json(row);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.file) data.foto = await uploadServicioImage(req.file);
    const row = await ServicioModel.update(req.params.id, data);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = await ServicioModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
