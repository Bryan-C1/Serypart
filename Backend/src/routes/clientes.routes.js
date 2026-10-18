const { Router } = require('express');
const controller = require('../controllers/clientes.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', requireAuth, controller.getAll);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);

module.exports = router;