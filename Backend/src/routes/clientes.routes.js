const { Router } = require('express');
const controller = require('../controllers/usuarios.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', requireAuth, controller.getClientes);

module.exports = router;