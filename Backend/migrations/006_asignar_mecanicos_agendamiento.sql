ALTER TABLE agendamiento
  ADD COLUMN id_mecanico INT NULL,
  ADD COLUMN id_mecanico_ocupado INT
    GENERATED ALWAYS AS (
      CASE
        WHEN id_mecanico IS NOT NULL AND estado NOT IN ('completada', 'cancelada') THEN id_mecanico
        ELSE NULL
      END
    ) STORED,
  ADD UNIQUE KEY uq_agendamiento_mecanico_ocupado (id_mecanico_ocupado);
