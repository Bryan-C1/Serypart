const VPIC_API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

async function fetchCatalogResults(path) {
  let response;
  try {
    response = await fetch(`${VPIC_API_URL}/${path}?format=json`, {
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      const timeoutError = new Error('El catálogo vPIC tardó demasiado en responder.');
      timeoutError.status = 504;
      throw timeoutError;
    }
    const connectionError = new Error('No fue posible conectar el servidor con el catálogo vPIC.');
    connectionError.status = 502;
    throw connectionError;
  }

  if (!response.ok) {
    const upstreamError = new Error(`El catálogo vPIC respondió con error HTTP ${response.status}.`);
    upstreamError.status = 502;
    throw upstreamError;
  }

  const data = await response.json();
  if (!Array.isArray(data.Results)) {
    const formatError = new Error('El catálogo vPIC devolvió una respuesta con formato inesperado.');
    formatError.status = 502;
    throw formatError;
  }
  return data.Results;
}

async function getMakes(req, res, next) {
  try {
    const results = await fetchCatalogResults('GetAllMakes');
    res.json(results);
  } catch (error) {
    next(error);
  }
}

async function getModels(req, res, next) {
  const makeId = String(req.params.makeId);
  if (!/^\d+$/.test(makeId) || Number(makeId) < 1) {
    return res.status(400).json({ message: 'El ID de la marca no es válido.' });
  }

  try {
    const results = await fetchCatalogResults(`GetModelsForMakeId/${makeId}`);
    res.json(results);
  } catch (error) {
    next(error);
  }
}

module.exports = { getMakes, getModels };
