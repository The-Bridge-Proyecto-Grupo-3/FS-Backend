# Backend API recomendación de gasolineras

## Primeros pasos

Clonar repositorio

```bash
	git clone https://github.com/The-Bridge-Proyecto-Grupo-3/FS-Backend backend
	cd backend
```

Instalar los paquetes

```bash
	npm i
```

Crear base de datos y dar permisos al usuario (root o el que sea)

```sql
	CREATE DATABASE nombre_db;
	GRANT ALL PRIVILEGES ON nombre_db.* TO 'user'@'localhost';
```

Configurar variables de entorno en .env

```bash
	cp .env.example .env
```

```env
	# .env
	DB_NAME=nombre_db
	DB_USER=usuario_db
	DB_PASS=contraseña_db

	# Buscar configuracion del proveedor de correo
	SMTP_HOST=
	SMTP_PORT=
	SMTP_SECURE=
	SMTP_USER=
	SMTP_PASS=
	MAIL_FROM="App <user@example.com>"
```

Configurar config/nodemailer.js para que haga uso de las variables usuario y contraseña

## Ejecutar

```bash
	npm run dev
```