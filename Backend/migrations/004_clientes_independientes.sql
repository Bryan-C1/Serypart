ALTER TABLE clientes
  MODIFY COLUMN nombre VARCHAR(100) NULL,
  MODIFY COLUMN apellido VARCHAR(100) NULL,
  MODIFY COLUMN numero_documento VARCHAR(30) NULL,
  MODIFY COLUMN telefono VARCHAR(30) NULL,
  MODIFY COLUMN email VARCHAR(150) NULL,
  MODIFY COLUMN direccion VARCHAR(255) NULL,
  ADD UNIQUE KEY uq_clientes_id_usuario (id_usuario);

ALTER TABLE vehiculos
  ADD COLUMN id_cliente INT NULL,
  ADD KEY idx_vehiculos_id_cliente (id_cliente);

ALTER TABLE venta
  ADD COLUMN id_cliente INT NULL,
  ADD KEY idx_venta_id_cliente (id_cliente);

ALTER TABLE agendamiento
  ADD COLUMN id_cliente INT NULL,
  ADD KEY idx_agendamiento_id_cliente (id_cliente);

INSERT INTO clientes
  (id_usuario, nombre, apellido, tipo_documento, numero_documento, fecha_registro, email, telefono, direccion, estado)
SELECT u.id_usuario, u.nombre, COALESCE(u.apellido, ''), u.tipo_documento, u.numero_documento,
       u.fecha_registro, u.email, u.telefono, u.direccion, COALESCE(u.estado, 'activo')
  FROM usuarios u
  LEFT JOIN roles r ON r.id_rol = u.id_rol
 WHERE (
     u.id_rol IS NULL
     OR LOWER(TRIM(r.nombre)) IN ('cliente', 'cliente web', 'usuario', 'usuario web', 'client')
     OR EXISTS (SELECT 1 FROM vehiculos v WHERE v.id_usuario = u.id_usuario)
     OR EXISTS (SELECT 1 FROM venta ve WHERE ve.id_usuario = u.id_usuario)
     OR EXISTS (SELECT 1 FROM agendamiento a WHERE a.id_usuario = u.id_usuario)
   )
   AND NOT EXISTS (
     SELECT 1 FROM clientes c WHERE c.id_usuario = u.id_usuario
   );

UPDATE vehiculos v
  JOIN clientes c ON c.id_usuario = v.id_usuario
   SET v.id_cliente = c.id_cliente
 WHERE v.id_cliente IS NULL;

UPDATE venta ve
  JOIN clientes c ON c.id_usuario = ve.id_usuario
   SET ve.id_cliente = c.id_cliente
 WHERE ve.id_cliente IS NULL;

UPDATE agendamiento a
  JOIN clientes c ON c.id_usuario = a.id_usuario
   SET a.id_cliente = c.id_cliente
 WHERE a.id_cliente IS NULL;
