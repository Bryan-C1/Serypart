const MAX_DESCRIPTION_LENGTH = 100;

async function addVehicleHistory(connection, idVehicle, sourcePrefix, description, date) {
  const text = String(description || '').slice(0, MAX_DESCRIPTION_LENGTH);
  const [existing] = await connection.query(
    `SELECT id_historial_vehiculos
       FROM historial_vehiculos
      WHERE id_vehiculo = ? AND descripcion LIKE ?
      LIMIT 1`,
    [idVehicle, `${sourcePrefix}%`]
  );
  if (existing.length > 0) return;

  await connection.query(
    'INSERT INTO historial_vehiculos (id_vehiculo, descripcion, fecha) VALUES (?, ?, ?)',
    [idVehicle, text, date]
  );
}

module.exports = { addVehicleHistory };
