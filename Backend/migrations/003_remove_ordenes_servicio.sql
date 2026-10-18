ALTER TABLE venta
  DROP FOREIGN KEY venta_ibfk_3,
  DROP COLUMN id_orden_servicio;

ALTER TABLE historial_vehiculos
  DROP FOREIGN KEY historial_vehiculos_ibfk_2,
  DROP COLUMN id_orden_servicio;

UPDATE roles
SET permisos = JSON_REMOVE(permisos, '$.ordenes')
WHERE permisos IS NOT NULL;

DROP TABLE detalle_orden_servicio;
DROP TABLE orden_servicio;
