# Guia de despliegue

Esta aplicacion es un servidor Node.js con Express. Puede desplegarse en servicios como Render, Railway, Fly.io o cualquier hosting que soporte Node.js.

## Variables de entorno

```env
PORT=30013
```

En produccion normalmente el proveedor define `PORT` automaticamente. La app ya usa `process.env.PORT`.

## Comandos

```bash
npm install
npm start
```

## Verificacion previa

```bash
npm test
```

## Endpoints utiles

- `GET /`
- `GET /razas`
- `GET /random-image`
- `GET /breed/:name`
- `GET /breed/:name/:subBreed`
- `GET /breed-image/:name`
- `GET /breed-image/:name/:subBreed`
