# Prisma

Aplicación para crear, explorar y probar combinaciones de color para diseño web, apps y uso diario.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Despliegue

El push a `main` dispara el workflow de GitHub Actions (`.github/workflows/deploy.yml`) que compila el proyecto y lo publica en GitHub Pages.

## Firebase

El proyecto usa Firebase (`prisma-83e5e`) para autenticación y guardado de paletas:

- **Auth**: Google Sign-In (`Authentication → Sign-in method → Google`). Dominios autorizados: `localhost` y `marinf-lab.github.io`.
- **Firestore**: cada paleta guardada vive en `users/{uid}/palettes/{id}`, privada por usuario. Reglas en `firestore.rules`.
- La configuración del SDK web (`src/firebase.js`) no es secreta — está protegida por las reglas de seguridad, no por ocultarla.
