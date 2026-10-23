START TRANSACTION;

INSERT INTO historial_vehiculos (id_vehiculo, descripcion, fecha)
SELECT completed.id_vehiculo, LEFT(completed.descripcion, 100), completed.fecha
  FROM (
    SELECT a.id_agendamiento, a.id_vehiculo, a.fecha_cita AS fecha,
           CONCAT(
             'Cita #', a.id_agendamiento, ': ',
             COALESCE(
               NULLIF(GROUP_CONCAT(s.nombre ORDER BY da.id_detalle_agendamiento SEPARATOR ', '), ''),
               'Servicio completado'
             )
           ) AS descripcion
      FROM agendamiento a
      LEFT JOIN detalle_agendamiento da ON da.id_agendamiento = a.id_agendamiento
      LEFT JOIN servicios s ON s.id_servicio = da.id_servicio
     WHERE a.estado = 'completada'
     GROUP BY a.id_agendamiento, a.id_vehiculo, a.fecha_cita
  ) completed
 WHERE NOT EXISTS (
   SELECT 1
     FROM historial_vehiculos hv
    WHERE hv.id_vehiculo = completed.id_vehiculo
      AND hv.descripcion LIKE CONCAT('Cita #', completed.id_agendamiento, ':%')
 );

INSERT INTO historial_vehiculos (id_vehiculo, descripcion, fecha)
SELECT paid_sales.id_vehiculo,
       LEFT(
         CONCAT(
           'Venta #', paid_sales.id_venta,
           ' pagada después de la cita #', paid_sales.id_agendamiento
         ),
         100
       ),
       paid_sales.fecha_venta
  FROM (
    SELECT v.id_venta, a.id_vehiculo, MIN(a.id_agendamiento) AS id_agendamiento,
           v.fecha_venta
      FROM venta v
      JOIN agendamiento a ON a.id_cliente = v.id_cliente
                        AND a.estado = 'completada'
                        AND DATE(a.fecha_cita) <= DATE(v.fecha_venta)
     WHERE v.estado = 'pagada'
     GROUP BY v.id_venta, a.id_vehiculo, v.fecha_venta
  ) paid_sales
 WHERE NOT EXISTS (
   SELECT 1
     FROM historial_vehiculos hv
    WHERE hv.id_vehiculo = paid_sales.id_vehiculo
      AND hv.descripcion LIKE CONCAT('Venta #', paid_sales.id_venta, ':%')
 );

COMMIT;
