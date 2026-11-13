const { Router } = require('express');
const controller = require('../controllers/mecanicos.controller');
const activityController = require('../controllers/mecanicos-actividad.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', requireAuth, controller.getAll);
router.get('/:id', requireAuth, controller.getById);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);
router.get('/:id/actividad-mensual', requireAuth, activityController.getMonthlyActivity);
router.post('/:id/asistencias', requireAuth, activityController.createAttendance);
router.put('/:id/asistencias/:idAsistencia', requireAuth, activityController.updateAttendance);
router.delete('/:id/asistencias/:idAsistencia', requireAuth, activityController.removeAttendance);

module.exports = router;
