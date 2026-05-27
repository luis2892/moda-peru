USE moda_peru;

-- Password para todos: Test1234!
-- Hash bcrypt generado con rounds=12
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Admin ModaPerú',  'admin@modaperu.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('María García',    'maria@test.com',     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente'),
('Carlos Pérez',    'carlos@test.com',    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Reviews de ejemplo
INSERT INTO reviews (producto_id, usuario_id, rating, comentario) VALUES
(1, 2, 5, 'Hermoso vestido, la tela es suave y el talle es perfecto. Lo recomiendo mucho.'),
(1, 3, 4, 'Me encantó el diseño, los colores son exactamente como en la foto.'),
(2, 2, 5, 'Excelente calidad, llegó en perfectas condiciones y el envío fue rápido.'),
(3, 3, 4, 'Muy linda falda, combina con todo. El talle es exacto.'),
(4, 2, 5, 'La chaqueta es increíble, cuero sintético de primera calidad.')
ON DUPLICATE KEY UPDATE comentario = VALUES(comentario);
