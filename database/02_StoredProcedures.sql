-- ============================================================
-- Script 02: Funciones almacenadas CRUD
-- Tabla: Tbl_Medicamentos
-- PostgreSQL - Funciones (Procedimientos Almacenados)
-- ============================================================

-- ============================================================
-- 1. CONSULTAR: devuelve todos los registros de la tabla
-- ============================================================
CREATE OR REPLACE FUNCTION Usp_Tbl_Medicamentos_Consultar()
RETURNS TABLE (
    "codigoMedicamento" INT,
    "nombreMedicamento" VARCHAR(150),
    "laboratorio" VARCHAR(100),
    "presentacion" VARCHAR(100),
    "concentracion" VARCHAR(50),
    "viaAdministracion" VARCHAR(50),
    "existencia" INT,
    "precioCompra" DECIMAL(12,2),
    "precioVenta" DECIMAL(12,2),
    "fechaVencimiento" DATE,
    "requiereReceta" SMALLINT,
    "estado" SMALLINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.CodigoMedicamento,
        m.NombreMedicamento,
        m.Laboratorio,
        m.Presentacion,
        m.Concentracion,
        m.ViaAdministracion,
        m.Existencia,
        m.PrecioCompra,
        m.PrecioVenta,
        m.FechaVencimiento,
        m.RequiereReceta,
        m.Estado
    FROM Tbl_Medicamentos m
    ORDER BY m.CodigoMedicamento;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. AGREGAR: inserta un medicamento y devuelve el codigo generado
-- ============================================================
CREATE OR REPLACE FUNCTION Usp_Tbl_Medicamentos_Agregar(
    p_NombreMedicamento VARCHAR(150),
    p_Laboratorio VARCHAR(100),
    p_Presentacion VARCHAR(100),
    p_Concentracion VARCHAR(50),
    p_ViaAdministracion VARCHAR(50),
    p_Existencia INT,
    p_PrecioCompra DECIMAL(12,2),
    p_PrecioVenta DECIMAL(12,2),
    p_FechaVencimiento DATE,
    p_RequiereReceta SMALLINT,
    p_Estado SMALLINT
)
RETURNS TABLE (
    "exito" INT,
    "mensaje" VARCHAR(250),
    "codigoMedicamento" INT
) AS $$
DECLARE
    v_Codigo INT;
BEGIN
    INSERT INTO Tbl_Medicamentos (
        NombreMedicamento, Laboratorio, Presentacion, Concentracion,
        ViaAdministracion, Existencia, PrecioCompra, PrecioVenta,
        FechaVencimiento, RequiereReceta, Estado
    ) VALUES (
        p_NombreMedicamento, p_Laboratorio, p_Presentacion, p_Concentracion,
        p_ViaAdministracion, p_Existencia, p_PrecioCompra, p_PrecioVenta,
        p_FechaVencimiento, COALESCE(p_RequiereReceta, 0), COALESCE(p_Estado, 1)
    )
    RETURNING CodigoMedicamento INTO v_Codigo;

    RETURN QUERY SELECT 1, 'Medicamento agregado correctamente.'::VARCHAR(250), v_Codigo;
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT -1, ('Error al agregar el medicamento: ' || SQLERRM)::VARCHAR(250), NULL::INT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 3. EDITAR: actualiza un medicamento por su llave primaria
-- ============================================================
CREATE OR REPLACE FUNCTION Usp_Tbl_Medicamentos_Editar(
    p_CodigoMedicamento INT,
    p_NombreMedicamento VARCHAR(150),
    p_Laboratorio VARCHAR(100),
    p_Presentacion VARCHAR(100),
    p_Concentracion VARCHAR(50),
    p_ViaAdministracion VARCHAR(50),
    p_Existencia INT,
    p_PrecioCompra DECIMAL(12,2),
    p_PrecioVenta DECIMAL(12,2),
    p_FechaVencimiento DATE,
    p_RequiereReceta SMALLINT,
    p_Estado SMALLINT
)
RETURNS TABLE (
    "exito" INT,
    "mensaje" VARCHAR(250)
) AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Tbl_Medicamentos WHERE CodigoMedicamento = p_CodigoMedicamento) THEN
        RETURN QUERY SELECT 0, ('No existe el medicamento con codigo ' || p_CodigoMedicamento || '.')::VARCHAR(250);
        RETURN;
    END IF;

    UPDATE Tbl_Medicamentos SET
        NombreMedicamento = p_NombreMedicamento,
        Laboratorio = p_Laboratorio,
        Presentacion = p_Presentacion,
        Concentracion = p_Concentracion,
        ViaAdministracion = p_ViaAdministracion,
        Existencia = p_Existencia,
        PrecioCompra = p_PrecioCompra,
        PrecioVenta = p_PrecioVenta,
        FechaVencimiento = p_FechaVencimiento,
        RequiereReceta = COALESCE(p_RequiereReceta, 0),
        Estado = COALESCE(p_Estado, 1)
    WHERE CodigoMedicamento = p_CodigoMedicamento;

    RETURN QUERY SELECT 1, 'Medicamento editado correctamente.'::VARCHAR(250);
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT -1, ('Error al editar el medicamento: ' || SQLERRM)::VARCHAR(250);
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 4. BUSCAR: devuelve un medicamento por su llave primaria
-- ============================================================
CREATE OR REPLACE FUNCTION Usp_Tbl_Medicamentos_Buscar(
    p_CodigoMedicamento INT
)
RETURNS TABLE (
    "codigoMedicamento" INT,
    "nombreMedicamento" VARCHAR(150),
    "laboratorio" VARCHAR(100),
    "presentacion" VARCHAR(100),
    "concentracion" VARCHAR(50),
    "viaAdministracion" VARCHAR(50),
    "existencia" INT,
    "precioCompra" DECIMAL(12,2),
    "precioVenta" DECIMAL(12,2),
    "fechaVencimiento" DATE,
    "requiereReceta" SMALLINT,
    "estado" SMALLINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.CodigoMedicamento,
        m.NombreMedicamento,
        m.Laboratorio,
        m.Presentacion,
        m.Concentracion,
        m.ViaAdministracion,
        m.Existencia,
        m.PrecioCompra,
        m.PrecioVenta,
        m.FechaVencimiento,
        m.RequiereReceta,
        m.Estado
    FROM Tbl_Medicamentos m
    WHERE m.CodigoMedicamento = p_CodigoMedicamento;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al buscar el medicamento: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 5. ELIMINAR: elimina un medicamento por su llave primaria
-- ============================================================
CREATE OR REPLACE FUNCTION Usp_Tbl_Medicamentos_Eliminar(
    p_CodigoMedicamento INT
)
RETURNS TABLE (
    "exito" INT,
    "mensaje" VARCHAR(250)
) AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Tbl_Medicamentos WHERE CodigoMedicamento = p_CodigoMedicamento) THEN
        RETURN QUERY SELECT 0, ('No existe el medicamento con codigo ' || p_CodigoMedicamento || '.')::VARCHAR(250);
        RETURN;
    END IF;

    DELETE FROM Tbl_Medicamentos WHERE CodigoMedicamento = p_CodigoMedicamento;

    RETURN QUERY SELECT 1, 'Medicamento eliminado correctamente.'::VARCHAR(250);
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT -1, ('Error al eliminar el medicamento: ' || SQLERRM)::VARCHAR(250);
END;
$$ LANGUAGE plpgsql;
