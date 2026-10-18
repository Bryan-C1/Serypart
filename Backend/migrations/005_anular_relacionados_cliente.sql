CREATE TABLE cliente_cascade_states (
  id_cliente INT NOT NULL,
  entidad ENUM('vehiculo', 'cita', 'venta') NOT NULL,
  id_registro INT NOT NULL,
  estado_anterior VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_cliente, entidad, id_registro),
  KEY idx_cliente_cascade_entidad (entidad, id_registro)
) ENGINE=InnoDB;

START TRANSACTION;

INSERT INTO cliente_cascade_states (id_cliente, entidad, id_registro, estado_anterior)
SELECT c.id_cliente, 'vehiculo', v.id_vehiculo, v.estado
  FROM clientes c
  JOIN vehiculos v ON v.id_cliente = c.id_cliente
 WHERE c.estado = 'anulado'
   AND v.estado <> 'anulado';

INSERT INTO cliente_cascade_states (id_cliente, entidad, id_registro, estado_anterior)
SELECT c.id_cliente, 'cita', a.id_agendamiento, a.estado
  FROM clientes c
  JOIN agendamiento a ON a.id_cliente = c.id_cliente
 WHERE c.estado = 'anulado'
   AND a.estado <> 'cancelada';

INSERT INTO cliente_cascade_states (id_cliente, entidad, id_registro, estado_anterior)
SELECT c.id_cliente, 'venta', ve.id_venta, ve.estado
  FROM clientes c
  JOIN venta ve ON ve.id_cliente = c.id_cliente
 WHERE c.estado = 'anulado'
   AND ve.estado <> 'cancelada';

UPDATE repuestos r
JOIN (
  SELECT dv.id_repuesto, SUM(dv.cantidad) AS cantidad
    FROM detalle_venta dv
    JOIN cliente_cascade_states ccs
      ON ccs.entidad = 'venta'
     AND ccs.id_registro = dv.id_venta
   GROUP BY dv.id_repuesto
) AS stock_to_restore ON stock_to_restore.id_repuesto = r.id_repuesto
   SET r.stock = r.stock + stock_to_restore.cantidad;

UPDATE vehiculos v
JOIN cliente_cascade_states ccs
  ON ccs.entidad = 'vehiculo'
 AND ccs.id_registro = v.id_vehiculo
   SET v.estado = 'anulado';

UPDATE agendamiento a
JOIN cliente_cascade_states ccs
  ON ccs.entidad = 'cita'
 AND ccs.id_registro = a.id_agendamiento
   SET a.estado = 'cancelada';

UPDATE venta ve
JOIN cliente_cascade_states ccs
  ON ccs.entidad = 'venta'
 AND ccs.id_registro = ve.id_venta
   SET ve.estado = 'cancelada';

COMMIT;
