const MecanicosActividadModel = require('../models/mecanicos-actividad.model');

async function getMonthlyActivity(req, res, next) {
  try {
    res.json(await MecanicosActividadModel.getMonthlyActivity(
      req.params.id,
      req.query.mes,
      req.query.fecha
    ));
  } catch (err) { next(err); }
}

async function createAttendance(req, res, next) {
  try {
    res.status(201).json(await MecanicosActividadModel.createAttendance(req.params.id, req.body));
  } catch (err) { next(err); }
}

async function updateAttendance(req, res, next) {
  try {
    res.json(await MecanicosActividadModel.updateAttendance(req.params.id, req.params.idAsistencia, req.body));
  } catch (err) { next(err); }
}

async function removeAttendance(req, res, next) {
  try {
    await MecanicosActividadModel.removeAttendance(req.params.id, req.params.idAsistencia);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = {
  getMonthlyActivity,
  createAttendance,
  updateAttendance,
  removeAttendance,
};
