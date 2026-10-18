const { Router } = require('express');
const controller = require('../controllers/search.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', requireAuth, controller.search);
router.get('/clientes/:id', requireAuth, controller.getClientDetails);
router.get('/:type/:id', requireAuth, controller.getEntityDetails);

module.exports = router;
