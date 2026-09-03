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
- **Firestore**: cada paleta guardada vive en `users/{uid}/palettes/{id}`, privada por usuario. Reglas en `firestore.rules` (recordá pegar la versión actualizada en la consola después de cada cambio).
- La configuración del SDK web (`src/firebase.js`) no es secreta — está protegida por las reglas de seguridad, no por ocultarla.

### Ampliar la librería de colores

La app siempre carga primero los ~100 colores curados que vienen en `src/data/curatedColors.js` (funciona sin Firestore). Si además existe la colección pública `colors` en Firestore, los documentos que no estén ya en la lista local se agregan automáticamente — así se puede seguir creciendo la librería sin tocar código.

Para importar el set inicial a Firestore (colección `colors`, un documento por color, con `name`, `hex`, `cat`):

```bash
# con Firebase CLI (requiere estar logueado y con el proyecto seleccionado)
firebase firestore:delete colors --recursive --force   # solo si querés limpiar antes
node -e "
const admin = require('firebase-admin');
const data = require('./scripts/curatedColors.json');
admin.initializeApp();
const db = admin.firestore();
(async () => {
  for (const c of data) await db.collection('colors').add(c);
  console.log('Listo:', data.length, 'colores importados');
})();
"
```

O importar `scripts/curatedColors.json` a mano desde la consola de Firestore, un documento por color.
