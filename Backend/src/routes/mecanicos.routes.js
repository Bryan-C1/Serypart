const { Router } = require('express');
const controller = require('../controllers/mecanicos.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', requireAuth, controller.getAll);
router.get('/:id', requireAuth, controller.getById);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);

module.exports = router;
