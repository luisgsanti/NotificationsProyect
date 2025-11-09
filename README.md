# Notifications Project

Este proyecto es un sistema de notificaciones en tiempo real, construido con **Laravel 12** en el backend y **Angular 18** en el frontend.

---

## 🚀 Versiones utilizadas

* **Angular CLI:** 18.2.21

* **Node.js:** 20.16.0

* **npm:** 10.8.1

* **PHP:** 8.2.12

* **Laravel Framework:** 12.36.1

* **MySQL (MariaDB incluida en XAMPP):** 10.4.32

---

## 🖥️ Backend (Laravel)

### 1. Instalación de dependencias

Ubicarse en la ruta del backend y ejecutar:

```bash
composer install
```

### 2. Configuración de la base de datos

Crear la base de datos en MySQL con el nombre:

```sql
notificationsproyect_db
```

Editar el archivo `.env` con tus credenciales de MySQL. Ejemplo:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=notificationsproyect_db
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Crear las tablas con migraciones

```bash
php artisan migrate
```

### 4. Ejecutar el servidor backend

```bash
php artisan serve
```

### 5. Iniciar Reverb para notificaciones en tiempo real

En una nueva terminal (manteniendo el backend corriendo):

```bash
php artisan reverb:start
```

---

## 🌐 Frontend (Angular)

### 1. Instalación de dependencias

Ubicarse en la ruta del frontend y ejecutar:

```bash
npm install
```

### 2. Configuración del entorno

Revisar que las URLs del backend estén correctas en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://127.0.0.1:8000', // URL DEL API
  reverbHost: '127.0.0.1',
  reverbPort: 6001,
  reverbKey: 'local',
  reverbScheme: 'ws'
};
```

### 3. Ejecutar el frontend

```bash
ng serve --open
```

---

## ⚠️ Notas adicionales

* Mantener **Reverb** corriendo para recibir notificaciones en tiempo real.
* Asegurarse de que los puertos del backend y Reverb no estén ocupados por otros procesos.
* Proyecto probado en entorno local con XAMPP (MariaDB 10.4.32).

---
---
---

# Uso de Postman para probar notificaciones en tiempo real

Para probar la funcionalidad de la aplicación y ver cómo funcionan las notificaciones en tiempo real, se debe utilizar **Postman**.

## Ruta para crear tareas

Método: **POST**
URL: `http://127.0.0.1:8000/api/tasks`

### Datos de ejemplo (JSON):

```json
{
  "user_id": 1,
  "title": "Nueva prueba Sanctum",
  "description": "Verificar autenticación funcionando",
  "status": "pendiente"
}
```

> Nota: Mantener el `user_id` en `1` porque es el único usuario activo actualmente.

Al enviar esta solicitud correctamente, la aplicación debería generar una **notificación en tiempo real** para el usuario con ID 1.

