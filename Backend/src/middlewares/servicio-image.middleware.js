const multer = require('multer');
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const parseImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error('La imagen debe ser JPG, PNG o WEBP.');
      error.status = 400;
      callback(error);
      return;
    }
    callback(null, true);
  },
}).single('foto');

function servicioImage(req, res, next) {
  parseImage(req, res, (error) => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        error.message = 'La imagen no puede superar los 5 MB.';
      }
      error.status = 400;
      next(error);
      return;
    }
    next();
  });
}

module.exports = servicioImage;
