-- ModaPerú Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS moda_peru CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE moda_peru;

-- ============================================================
-- USUARIOS
-- ============================================================
CREATE TABLE usuarios (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telefono      VARCHAR(20),
  rol           ENUM('cliente', 'admin') DEFAULT 'cliente',
  activo        TINYINT(1) DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- ============================================================
-- PRODUCTOS
-- ============================================================
CREATE TABLE productos (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  nombre           VARCHAR(150) NOT NULL,
  slug             VARCHAR(160) NOT NULL UNIQUE,
  descripcion      TEXT,
  precio           DECIMAL(10,2) NOT NULL,
  precio_original  DECIMAL(10,2),
  stock            INT DEFAULT 0,
  categoria        VARCHAR(50) NOT NULL,
  imagen_principal VARCHAR(255),
  descuento        INT DEFAULT 0 COMMENT 'Porcentaje de descuento 0-100',
  es_nuevo         TINYINT(1) DEFAULT 0,
  es_trending      TINYINT(1) DEFAULT 0,
  activo           TINYINT(1) DEFAULT 1,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categoria (categoria),
  INDEX idx_slug (slug),
  INDEX idx_activo (activo),
  FULLTEXT idx_busqueda (nombre, descripcion)
);

-- ============================================================
-- IMÁGENES PRODUCTO
-- ============================================================
CREATE TABLE producto_imagenes (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  producto_id INT NOT NULL,
  url         VARCHAR(255) NOT NULL,
  orden       INT DEFAULT 0,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ============================================================
-- VARIANTES (talla + color)
-- ============================================================
CREATE TABLE producto_variantes (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  producto_id INT NOT NULL,
  talla       VARCHAR(10),
  color       VARCHAR(50),
  stock       INT DEFAULT 0,
  sku         VARCHAR(80) UNIQUE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ============================================================
-- ORDENES
-- ============================================================
CREATE TABLE ordenes (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id        INT,
  total             DECIMAL(10,2) NOT NULL,
  estado            ENUM('pendiente','pagado','procesando','enviado','entregado','cancelado','fallido') DEFAULT 'pendiente',
  metodo_pago       VARCHAR(30),
  stripe_session_id VARCHAR(255),
  direccion_envio   JSON,
  numero_seguimiento VARCHAR(100),
  fecha_pago        DATETIME,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_usuario (usuario_id),
  INDEX idx_estado (estado)
);

-- ============================================================
-- ITEMS DE ORDEN
-- ============================================================
CREATE TABLE items_orden (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  orden_id        INT NOT NULL,
  producto_id     INT,
  nombre_producto VARCHAR(150),
  cantidad        INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  talla           VARCHAR(10),
  color           VARCHAR(50),
  FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  producto_id INT NOT NULL,
  usuario_id  INT,
  rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comentario  TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE KEY uniq_review (producto_id, usuario_id)
);

-- ============================================================
-- WISHLIST
-- ============================================================
CREATE TABLE wishlist (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id  INT NOT NULL,
  producto_id INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_wishlist (usuario_id, producto_id)
);

-- ============================================================
-- DIRECCIONES GUARDADAS
-- ============================================================
CREATE TABLE direcciones (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id  INT NOT NULL,
  alias       VARCHAR(50) DEFAULT 'Casa',
  nombre      VARCHAR(100),
  telefono    VARCHAR(20),
  direccion   VARCHAR(255) NOT NULL,
  distrito    VARCHAR(100),
  ciudad      VARCHAR(100) DEFAULT 'Lima',
  predeterminada TINYINT(1) DEFAULT 0,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- SEED: Categorías demo y un admin
-- ============================================================
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Admin ModaPerú', 'admin@modaperu.com', '$2a$12$placeholder_hash_change_this', 'admin');

INSERT INTO productos (nombre, slug, descripcion, precio, precio_original, stock, categoria, imagen_principal, descuento, es_nuevo, es_trending) VALUES
('Vestido Floral Bohemio', 'vestido-floral-bohemio', 'Vestido largo con estampado floral inspirado en los patrones andinos. Algodón premium.', 189.00, 240.00, 25, 'vestidos', '/uploads/vestido-floral.jpg', 21, 1, 1),
('Blusa Lino Premium', 'blusa-lino-premium', 'Blusa de lino natural con corte holgado. Ideal para clima cálido.', 89.00, 89.00, 40, 'blusas', '/uploads/blusa-lino.jpg', 0, 0, 1),
('Falda Midi Elegante', 'falda-midi-elegante', 'Falda midi con vuelo y detalle plisado. Versatil para oficina o salida.', 135.00, 135.00, 18, 'faldas', '/uploads/falda-midi.jpg', 0, 1, 1),
('Chaqueta Cuero Sintético', 'chaqueta-cuero-sintetico', 'Chaqueta estilo moto en cuero vegano de alta calidad. Forro interior.', 299.00, 380.00, 10, 'chaquetas', '/uploads/chaqueta-cuero.jpg', 21, 0, 1),
('Pantalón Wide Leg', 'pantalon-wide-leg', 'Pantalón de tiro alto con pierna ancha. Tejido fluido importado.', 145.00, 145.00, 30, 'pantalones', '/uploads/pantalon-wide.jpg', 0, 1, 0),
('Bolso Artesanal Lima', 'bolso-artesanal-lima', 'Bolso tejido a mano por artesanas peruanas. Cada pieza es única.', 199.00, 199.00, 8, 'accesorios', '/uploads/bolso-artesanal.jpg', 0, 1, 1);
