-- ============================================================
-- Script 01: Tabla asignada Tbl_Medicamentos
-- Base de datos: VeterinariaDB (se crea via docker-compose)
-- PostgreSQL
-- ============================================================

CREATE TABLE IF NOT EXISTS Tbl_Medicamentos (
    CodigoMedicamento SERIAL PRIMARY KEY,
    NombreMedicamento VARCHAR(150) NOT NULL,
    Laboratorio VARCHAR(100) NOT NULL,
    Presentacion VARCHAR(100) NOT NULL,
    Concentracion VARCHAR(50),
    ViaAdministracion VARCHAR(50),
    Existencia INT NOT NULL DEFAULT 0,
    PrecioCompra DECIMAL(12,2) NOT NULL,
    PrecioVenta DECIMAL(12,2) NOT NULL,
    FechaVencimiento DATE NOT NULL,
    RequiereReceta SMALLINT NOT NULL DEFAULT 0,
    Estado SMALLINT NOT NULL DEFAULT 1
);
