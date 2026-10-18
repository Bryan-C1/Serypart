const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (cloudinaryUrl !== undefined) delete process.env.CLOUDINARY_URL;

let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
} finally {
  if (cloudinaryUrl !== undefined) process.env.CLOUDINARY_URL = cloudinaryUrl;
}

function getCloudinaryConfig() {
  const configuredUrl = process.env.CLOUDINARY_URL?.trim();
  const url = configuredUrl?.replace(/^CLOUDINARY_URL\s*=\s*/i, '');
  if (!url) {
    const error = new Error('Configura CLOUDINARY_URL en las variables de entorno del backend.');
    error.status = 503;
    throw error;
  }

  if (!url.toLowerCase().startsWith('cloudinary://')) {
    const error = new Error('CLOUDINARY_URL debe tener el formato cloudinary://<api_key>:<api_secret>@<cloud_name>. No incluyas CLOUDINARY_URL= dentro del valor.');
    error.status = 500;
    throw error;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    const error = new Error('CLOUDINARY_URL no tiene un formato válido.');
    error.status = 500;
    throw error;
  }

  if (
    parsedUrl.protocol !== 'cloudinary:' ||
    !parsedUrl.username ||
    !parsedUrl.password ||
    !parsedUrl.hostname
  ) {
    const error = new Error('CLOUDINARY_URL no tiene un formato válido.');
    error.status = 500;
    throw error;
  }

  try {
    return {
      cloud_name: parsedUrl.hostname,
      api_key: decodeURIComponent(parsedUrl.username),
      api_secret: decodeURIComponent(parsedUrl.password),
    };
  } catch {
    const error = new Error('CLOUDINARY_URL contiene caracteres codificados no válidos.');
    error.status = 500;
    throw error;
  }
}

async function uploadServicioImage(file) {
  cloudinary.config(getCloudinaryConfig());

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'serypart/servicios', resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(new Error(`No se pudo almacenar la imagen en Cloudinary: ${error.message}`));
          return;
        }
        if (!result?.secure_url) {
          reject(new Error('Cloudinary no devolvió la URL de la imagen.'));
          return;
        }
        resolve(result.secure_url);
      }
    ).end(file.buffer);
  });
}

module.exports = { getCloudinaryConfig, uploadServicioImage };
