-- Esquema MySQL para Club de Tenis - SisInfo2
-- Ejecutar: CREATE DATABASE club_tenis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE club_tenis;

CREATE TABLE socios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20) NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    fecha_alta DATE NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE pistas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero TINYINT UNSIGNED NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    activa TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE tarifas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    precio_hora DECIMAL(8,2) NOT NULL,
    tarifa_cancelacion_minima DECIMAL(8,2) NOT NULL,
    vigente_desde DATE NOT NULL,
    vigente_hasta DATE NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE reservas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    socio_id BIGINT UNSIGNED NOT NULL,
    pista_id BIGINT UNSIGNED NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado ENUM('activa', 'cancelada', 'completada', 'no_ocupada') NOT NULL DEFAULT 'activa',
    ocupada TINYINT(1) NULL,
    cancelada_at TIMESTAMP NULL,
    primera_no_ocupacion_anio TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY reservas_pista_fecha_hora (pista_id, fecha, hora_inicio),
    KEY reservas_socio_fecha (socio_id, fecha),
    CONSTRAINT fk_reservas_socio FOREIGN KEY (socio_id) REFERENCES socios(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservas_pista FOREIGN KEY (pista_id) REFERENCES pistas(id) ON DELETE CASCADE
);

CREATE TABLE facturas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    socio_id BIGINT UNSIGNED NOT NULL,
    anio SMALLINT UNSIGNED NOT NULL,
    mes TINYINT UNSIGNED NOT NULL,
    horas_reservadas INT UNSIGNED NOT NULL DEFAULT 0,
    horas_canceladas INT UNSIGNED NOT NULL DEFAULT 0,
    horas_no_ocupadas_cobradas INT UNSIGNED NOT NULL DEFAULT 0,
    precio_hora_aplicado DECIMAL(8,2) NOT NULL,
    tarifa_cancelacion_aplicada DECIMAL(8,2) NOT NULL,
    importe_reservas DECIMAL(10,2) NOT NULL DEFAULT 0,
    importe_cancelaciones DECIMAL(10,2) NOT NULL DEFAULT 0,
    importe_no_ocupacion DECIMAL(10,2) NOT NULL DEFAULT 0,
    importe_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    estado ENUM('pendiente', 'enviada', 'pagada') NOT NULL DEFAULT 'pendiente',
    fecha_emision TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY facturas_socio_periodo (socio_id, anio, mes),
    CONSTRAINT fk_facturas_socio FOREIGN KEY (socio_id) REFERENCES socios(id) ON DELETE CASCADE
);

-- Datos iniciales
INSERT INTO pistas (numero, nombre, activa, created_at, updated_at) VALUES
(1, 'Pista 1', 1, NOW(), NOW()),
(2, 'Pista 2', 1, NOW(), NOW()),
(3, 'Pista 3', 1, NOW(), NOW()),
(4, 'Pista 4', 1, NOW(), NOW()),
(5, 'Pista 5', 1, NOW(), NOW());

INSERT INTO tarifas (precio_hora, tarifa_cancelacion_minima, vigente_desde, created_at, updated_at) VALUES
(15.00, 5.00, '2026-01-01', NOW(), NOW());
