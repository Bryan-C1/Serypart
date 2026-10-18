export const initialRepuestos = [
  { id_repuesto: 1, nombre: "Filtro de Aceite Premium", descripcion: "Filtro de aceite para motor", id_marca_repuesto: 1, precio_unitario: 12, stock: 25, stock_minimo: 10, estado: "disponible" },
  { id_repuesto: 2, nombre: "Pastillas de Freno Delanteras", descripcion: "Pastillas para frenos delanteros", id_marca_repuesto: 2, precio_unitario: 45, stock: 8, stock_minimo: 10, estado: "bajo_stock" },
  { id_repuesto: 3, nombre: "Aceite Motor 10W-40", descripcion: "Aceite sintético para motor", id_marca_repuesto: 3, precio_unitario: 28, stock: 15, stock_minimo: 20, estado: "bajo_stock" },
  { id_repuesto: 4, nombre: "Batería 12V 60Ah", descripcion: "Batería para vehículo", id_marca_repuesto: 4, precio_unitario: 95, stock: 0, stock_minimo: 5, estado: "agotado" },
  { id_repuesto: 5, nombre: "Bujías Platinum", descripcion: "Bujías de encendido", id_marca_repuesto: 1, precio_unitario: 8, stock: 40, stock_minimo: 15, estado: "disponible" },
];

export const emptyForm = {
  nombre: "", descripcion: "", id_marca_repuesto: 1, precio_unitario: 0, stock: 0, stock_minimo: 10, estado: "disponible",
};

export const marcasRepuesto = [
  { id: 1, nombre: "Toyota" },
  { id: 2, nombre: "Honda" },
  { id: 3, nombre: "Chevrolet" },
  { id: 4, nombre: "Ford" },
];
