import { apiRequest } from "../../../../shared/services/api";

let makesRequest;
const modelsRequests = new Map();

export function refreshVehicleCatalog() {
  makesRequest = undefined;
  modelsRequests.clear();
}

function normalizeName(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
}

export function getVehicleMakes() {
  if (!makesRequest) {
    makesRequest = Promise.all([
      apiRequest("/catalogo-vehiculos/marcas"),
      apiRequest("/marcas"),
    ])
      .then(([apiMakes, databaseMakes]) => {
        if (!Array.isArray(apiMakes) || !Array.isArray(databaseMakes)) {
          throw new Error("La API devolvió un formato inválido para las marcas.");
        }
        return apiMakes
          .filter((make) => make.Make_ID && make.Make_Name)
          .map((make) => {
            const databaseMake = databaseMakes.find(
              (item) => normalizeName(item.nombre) === normalizeName(make.Make_Name)
            );
            return {
              ...make,
              Make_ID: Number(make.Make_ID),
              Catalog_Source: "vpic",
              Database_ID: databaseMake ? Number(databaseMake.id_marca) : null,
            };
          })
          .sort((a, b) => a.Make_Name.localeCompare(b.Make_Name));
      })
      .catch((error) => {
        makesRequest = undefined;
        throw error;
      });
  }
  return makesRequest;
}

export function getVehicleModels(make) {
  const key = String(make.Make_ID);
  if (!modelsRequests.has(key)) {
    const request = Promise.all([
      apiRequest(`/catalogo-vehiculos/marcas/${encodeURIComponent(make.Make_ID)}/modelos`),
      apiRequest("/modelos"),
    ])
      .then(([apiModels, databaseModels]) => {
        if (!Array.isArray(apiModels) || !Array.isArray(databaseModels)) {
          throw new Error("La API devolvió un formato inválido para los modelos.");
        }
        return apiModels
          .filter((model) => model.Model_ID && model.Model_Name)
          .map((model) => {
            const databaseModel = make.Database_ID
              ? databaseModels.find((item) => (
                String(item.id_marca) === String(make.Database_ID)
                && normalizeName(item.nombre) === normalizeName(model.Model_Name)
              ))
              : null;
            return {
              ...model,
              Model_ID: Number(model.Model_ID),
              Catalog_Source: "vpic",
              Database_ID: databaseModel ? Number(databaseModel.id_modelo) : null,
            };
          })
          .sort((a, b) => a.Model_Name.localeCompare(b.Model_Name));
      })
      .catch((error) => {
        modelsRequests.delete(key);
        throw error;
      });
    modelsRequests.set(key, request);
  }
  return modelsRequests.get(key);
}

export async function ensureDatabaseMake(make) {
  const databaseMakes = await apiRequest("/marcas");
  if (!Array.isArray(databaseMakes)) throw new Error("La API devolvió un formato inválido para las marcas.");
  const existing = databaseMakes.find((item) => normalizeName(item.nombre) === normalizeName(make.Make_Name));
  if (existing) return Number(existing.id_marca);

  const created = await apiRequest("/marcas", {
    method: "POST",
    body: { nombre: make.Make_Name, descripcion: "Sincronizada desde el catálogo de vehículos." },
  });
  if (!created?.id_marca) throw new Error("No se pudo registrar la marca seleccionada en la base de datos.");
  refreshVehicleCatalog();
  return Number(created.id_marca);
}

export async function ensureDatabaseModel(model, idMarca) {
  const databaseModels = await apiRequest("/modelos");
  if (!Array.isArray(databaseModels)) throw new Error("La API devolvió un formato inválido para los modelos.");
  const existing = databaseModels.find((item) => (
    String(item.id_marca) === String(idMarca)
    && normalizeName(item.nombre) === normalizeName(model.Model_Name)
  ));
  if (existing) return Number(existing.id_modelo);

  const created = await apiRequest("/modelos", {
    method: "POST",
    body: { nombre: model.Model_Name, id_marca: Number(idMarca) },
  });
  if (!created?.id_modelo) throw new Error("No se pudo registrar el modelo seleccionado en la base de datos.");
  refreshVehicleCatalog();
  return Number(created.id_modelo);
}
