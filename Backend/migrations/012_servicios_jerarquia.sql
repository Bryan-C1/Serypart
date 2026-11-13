ALTER TABLE servicios
  ADD COLUMN id_servicio_padre INT NULL AFTER id_servicio,
  ADD COLUMN codigo VARCHAR(32) NULL AFTER id_servicio_padre,
  ADD KEY idx_servicios_padre (id_servicio_padre),
  ADD UNIQUE KEY uq_servicios_codigo (codigo),
  ADD CONSTRAINT fk_servicio_padre
    FOREIGN KEY (id_servicio_padre) REFERENCES servicios (id_servicio)
    ON DELETE RESTRICT;

UPDATE servicios
   SET codigo = CAST(id_servicio AS CHAR);

ALTER TABLE servicios
  MODIFY COLUMN codigo VARCHAR(32) NOT NULL;
