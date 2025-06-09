# 👨‍💻 Microservicio de Listas de Reproducción – StreamFlow

Este microservicio forma parte del proyecto **StreamFlow**, De la asignatura **Arquitectura de Sistemas**. Administra la información relacionada a las listas de reproducciones y a los videos, dentro de estos se pueden crear, eliminar y buscar.

---

## 📋 Requisitos

- Node.js v18.x o superior  
- Docker  
- RabbitMQ   
- PostgreSQL   
- Postman 

---

## 🚀 Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/Taller2-AS/playlists-service.git
cd playlistsService
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Crea el archivo `.env`

Ejemplo:

```env
POSTGRES_URI=postgres://playlist_user:playlist_pass@localhost:5435/playlist_db

SERVER_URL=localhost
SERVER_PORT=3001

RABBITMQ_URL=amqp://admin:admin@localhost:5672

```

> ⚠️ Asegúrate de que PostgreSQL y RabbitMQ estén corriendo en tu entorno local.

---

### 4. Levanta PostgreSQL y RabbitMQ con Docker

```bash
docker-compose up -d
```

---

### 5. Ejecuta el seeder (opcional)

```bash
npm run seed
```

Esto insertará 500 registros falsos de videos para pruebas.

---

### 6. Inicia el microservicio

```bash
npm start
```
---

## 👨‍💻 Desarrollado por

**Desarrollador A - Martin Becerra**  
Universidad Católica del Norte – Arquitectura de Sistemas