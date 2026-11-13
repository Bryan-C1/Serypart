function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;

  const error = new Error('JWT_SECRET no está configurado. Define esta variable en Backend/.env y reinicia la API.');
  error.status = 500;
  throw error;
}

module.exports = { getJwtSecret };
