# SisInfo2 — Sistema de Reservas de Pistas de Tenis

Proyecto full-stack con **React** (frontend) y **Laravel** (backend API) para la gestión de reservas de un club de tenis.

## Estructura del proyecto

```
SisInfo2/
├── backend/          # API REST con Laravel 12
├── frontend/         # Interfaz React + Vite
├── database/
│   └── schema.sql    # Esquema MySQL de referencia
└── README.md
```

## Requisitos

- PHP 8.2+
- Composer
- Node.js 18+
- XAMPP/MySQL (opcional; por defecto usa SQLite)

## Sprint 1 — Gestión de socios

| ID | Funcionalidad | Estado |
|----|---------------|--------|
| 1  | Registrar socios del club | Implementado |
| 2  | Gestionar socios (buscar, editar, eliminar) | Implementado |

## Base de datos

### Tablas principales

| Tabla | Descripción |
|-------|-------------|
| `socios` | Miembros del club (altas/bajas) |
| `pistas` | 5 pistas de tenis |
| `tarifas` | Precio por hora y tarifa mínima de cancelación |
| `reservas` | Reservas por bloques de 1 hora |
| `facturas` | Facturación mensual por socio |

> Las tablas de reservas y facturas están creadas para sprints futuros. El Sprint 1 solo usa `socios`.

### Opción A: SQLite (desarrollo rápido)

Ya configurado por defecto en `backend/.env`.

### Opción B: MySQL (XAMPP)

1. Crear la base de datos en phpMyAdmin: `club_tenis`
2. Editar `backend/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=club_tenis
DB_USERNAME=root
DB_PASSWORD=
```

3. Ejecutar migraciones (ver sección Backend).

También puedes importar `database/schema.sql` directamente en MySQL.

---

## Levantar el entorno

### 1. Backend (Laravel)

```powershell
cd backend
composer install
copy .env.example .env   # si no existe .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

La API quedará en: **http://localhost:8000**

#### Endpoints del Sprint 1

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/socios?busqueda=` | Listar/buscar socios |
| POST | `/api/socios` | Registrar socio |
| GET | `/api/socios/{id}` | Ver socio |
| PUT | `/api/socios/{id}` | Actualizar socio |
| DELETE | `/api/socios/{id}` | Eliminar socio |

### 2. Frontend (React)

En otra terminal:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

La app quedará en: **http://localhost:5173**

---

## Reglas de negocio (referencia para sprints futuros)

- Solo socios pueden reservar pistas.
- 5 pistas, reservas por bloques de 1 hora.
- Cancelación permitida si no es el mismo día.
- Reservas hasta 1 mes de antelación, sin límite por socio.
- Facturación mensual: horas reservadas × precio/hora.
- Cancelaciones incluyen tarifa mínima de castigo.
- Primera no-ocupación del año natural: sin cargo; las siguientes se facturan como uso real.

---

## Equipo
