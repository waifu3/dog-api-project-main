# Dog API Project

Aplicacion web construida con Node.js y Express que consume la API publica de Dog CEO para explorar razas, subrazas e imagenes de perros.

## Caracteristicas

- Lista razas y subrazas de perros.
- Busqueda por raza o subraza.
- Ordenamiento A-Z y Z-A.
- Favoritos guardados en el navegador.
- Filtro para ver solo favoritos y opcion para limpiarlos.
- Imagenes por raza y subraza.
- Imagen aleatoria.
- Historial de las ultimas 10 imagenes vistas.
- Copia del enlace de la imagen actual.
- Descarga de la imagen actual desde el navegador.
- Modo claro/oscuro con preferencia guardada.
- Cache temporal del listado de razas.
- Cabeceras de seguridad con Helmet.
- Pruebas de backend y utilidades frontend.

## Requisitos

- Node.js
- npm

## Instalacion

```bash
npm install
```

## Configuracion

Copia el archivo de ejemplo si quieres definir variables locales:

```bash
copy .env.example .env
```

Variable disponible:

```env
PORT=30013
```

## Uso

```bash
npm start
```

Por defecto la aplicacion queda disponible en:

```text
http://localhost:30013
```

Tambien puedes usar otro puerto:

```powershell
$env:PORT=32123
npm start
```

## Pruebas

```bash
npm test
```

## Verificacion de sintaxis

```bash
npm run check
```

## Endpoints

- `GET /`: interfaz web.
- `GET /razas`: devuelve totales y listado de razas/subrazas.
- `GET /random-image`: devuelve una URL de imagen aleatoria.
- `GET /breed/:name`: redirige a una imagen aleatoria de una raza.
- `GET /breed/:name/:subBreed`: redirige a una imagen aleatoria de una subraza.
- `GET /breed-image/:name`: devuelve una URL de imagen aleatoria de una raza.
- `GET /breed-image/:name/:subBreed`: devuelve una URL de imagen aleatoria de una subraza.

## Estructura

```text
index.js
routes/
  dogRoutes.js
services/
  dogService.js
views/
  app.js
  app-utils.js
  index.html
  styles.css
frontend-utils.test.js
tests.test.js
```

## Despliegue

Consulta [DEPLOYMENT.md](./DEPLOYMENT.md) para una guia breve de despliegue.
