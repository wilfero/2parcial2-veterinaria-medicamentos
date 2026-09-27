-- ============================================================
-- Script 03: Datos de prueba (5 registros)
-- Tabla: Tbl_Medicamentos
-- ============================================================

INSERT INTO Tbl_Medicamentos
    (NombreMedicamento, Laboratorio, Presentacion, Concentracion, ViaAdministracion,
     Existencia, PrecioCompra, PrecioVenta, FechaVencimiento, RequiereReceta, Estado)
VALUES
    ('Amoxicilina Veterinaria', 'Holland Animal Health', 'Suspension oral 60 ml', '250 mg/5 ml', 'Oral', 40, 45.00, 75.00, '2027-08-15', 1, 1),
    ('Ivermectina 1%', 'Bayer', 'Frasco inyectable 50 ml', '10 mg/ml', 'Subcutanea', 25, 80.00, 135.00, '2027-03-30', 1, 1),
    ('Meloxicam', 'Boehringer Ingelheim', 'Tabletas x 10', '1.5 mg', 'Oral', 60, 35.50, 60.00, '2026-12-31', 1, 1),
    ('Shampoo Antipulgas', 'Virbac', 'Botella 250 ml', '0.5 %', 'Topica', 18, 55.00, 95.00, '2028-01-20', 0, 1),
    ('Vitamina B12', 'Zoetis', 'Frasco inyectable 20 ml', '1000 mcg/ml', 'Intramuscular', 12, 28.75, 50.00, '2027-06-10', 0, 0);
