const { Router } = require('express');
const controller = require('../controllers/vehicle-catalog.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.get('/marcas', requireAuth, controller.getMakes);
router.get('/marcas/:makeId/modelos', requireAuth, controller.getModels);

module.exports = router;
