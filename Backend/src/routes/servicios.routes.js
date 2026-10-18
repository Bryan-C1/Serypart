const { Router } = require('express');
const controller = require('../controllers/servicios.controller');
const requireAuth = require('../middlewares/auth.middleware');
const servicioImage = require('../middlewares/servicio-image.middleware');

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', requireAuth, servicioImage, controller.create);
router.put('/:id', requireAuth, servicioImage, controller.update);
router.delete('/:id', requireAuth, controller.remove);

module.exports = router;
