-- Roles base del sistema
INSERT INTO roles (nombre, descripcion, fijo) VALUES
    ('Superusuario', 'Control total del sistema', true),
    ('Editor', 'Puede crear, editar y publicar actividades', false),
    ('Colaborador', 'Puede crear actividades', false)
ON CONFLICT (nombre) DO NOTHING;

-- Permisos base del sistema
INSERT INTO permisos (nombre, descripcion, categoria) VALUES
    ('crear_actividades', 'Crear actividades', 'Actividades'),
    ('editar_actividades', 'Editar actividades', 'Actividades'),
    ('eliminar_actividades', 'Eliminar actividades', 'Actividades'),
    ('publicar_actividades', 'Publicar/ocultar actividades', 'Actividades'),
    ('crear_usuarios', 'Crear usuarios', 'Usuarios'),
    ('gestionar_roles', 'Gestionar roles y permisos', 'Usuarios'),
    ('crear_graficas', 'Crear gráficas', 'Gráficas')
ON CONFLICT (nombre) DO NOTHING;

-- Superusuario: todos los permisos
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT (SELECT id FROM roles WHERE nombre = 'Superusuario'), id FROM permisos
ON CONFLICT DO NOTHING;

-- Editor: permisos parciales
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT (SELECT id FROM roles WHERE nombre = 'Editor'), id FROM permisos
WHERE nombre IN ('crear_actividades', 'editar_actividades', 'publicar_actividades', 'crear_graficas')
ON CONFLICT DO NOTHING;

-- Colaborador: permiso mínimo
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT (SELECT id FROM roles WHERE nombre = 'Colaborador'), id FROM permisos
WHERE nombre = 'crear_actividades'
ON CONFLICT DO NOTHING;

-- Categorías base
INSERT INTO categorias (nombre) VALUES
    ('Medio ambiente'),
    ('Educación'),
    ('Comunidad')
ON CONFLICT (nombre) DO NOTHING;

-- Primer Superusuario (contraseña: admin123 — cámbiala después de tu primer login)
INSERT INTO usuarios (nombre, email, password_hash, rol_id, created_at)
SELECT 'Administrador', 'admin@fundacion.org',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       (SELECT id FROM roles WHERE nombre = 'Superusuario'),
       now()
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@fundacion.org');