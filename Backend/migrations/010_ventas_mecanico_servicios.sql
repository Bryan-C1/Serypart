ALTER TABLE venta
  ADD COLUMN id_agendamiento INT NULL,
  ADD KEY idx_venta_id_agendamiento (id_agendamiento),
  ADD CONSTRAINT fk_venta_agendamiento
    FOREIGN KEY (id_agendamiento) REFERENCES agendamiento (id_agendamiento)
    ON DELETE RESTRICT;

CREATE TABLE detalle_venta_servicios (
  id_detalle_venta_servicio INT NOT NULL AUTO_INCREMENT,
  id_venta INT NOT NULL,
  id_servicio INT NULL,
  nombre_servicio VARCHAR(150) NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (id_detalle_venta_servicio),
  KEY idx_detalle_venta_servicio_venta (id_venta),
  CONSTRAINT fk_detalle_venta_servicio_venta
    FOREIGN KEY (id_venta) REFERENCES venta (id_venta)
    ON DELETE CASCADE,
  CONSTRAINT fk_detalle_venta_servicio_catalogo
    FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio)
    ON DELETE SET NULL,
  CONSTRAINT chk_detalle_venta_servicio_cantidad
    CHECK (cantidad > 0),
  CONSTRAINT chk_detalle_venta_servicio_precio
    CHECK (precio_unitario >= 0 AND subtotal >= 0)
);
