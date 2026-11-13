ALTER TABLE venta
  ADD COLUMN id_agendamiento INT NULL,
  ADD KEY idx_venta_id_agendamiento (id_agendamiento),
  ADD CONSTRAINT fk_venta_agendamiento
    FOREIGN KEY (id_agendamiento) REFERENCES agendamiento (id_agendamiento)
    ON DELETE RESTRICT;

ALTER TABLE detalle_venta
  MODIFY COLUMN id_repuesto INT NULL,
  ADD COLUMN id_servicio INT NULL AFTER id_repuesto,
  ADD COLUMN nombre_servicio VARCHAR(150) NULL AFTER id_servicio,
  ADD KEY idx_detalle_venta_servicio (id_servicio),
  ADD CONSTRAINT fk_detalle_venta_servicio
    FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio)
    ON DELETE SET NULL;
