# Guía de Despliegue — Sistema Obra

La aplicación compila a archivos estáticos en la carpeta `dist/`. Cualquier
servicio de hosting estático (Firebase Hosting, Vercel, Netlify, GitHub Pages)
es válido. Abajo se detallan las opciones recomendadas.

## 0. Build de producción

```bash
npm install
npm run build
```

Esto ejecuta el typecheck (`tsc --noEmit`) y genera `dist/`. Verifica que
no haya errores antes de desplegar.

> Asegúrate de que tu `.env` (o las variables de entorno del hosting) contenga
> las credenciales de Firebase. Vite expone solo variables con prefijo
> `VITE_`.

---

## 1. Firebase Hosting (recomendado)

El repositorio ya incluye `firebase.json` con el rewrite SPA y cabeceras de
caché para assets estáticos.

1. Instala la CLI:

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. (Opcional) Asocia el proyecto. Edita `firebase.json` para agregar tu
   `projectId`, o ejecuta:

   ```bash
   firebase use --add
   ```

3. Despliega:

   ```bash
   firebase deploy
   ```

   Esto publica `dist/` y aplica `firestore.rules`.

4. Para desplegar solo hosting o solo reglas:

   ```bash
   firebase deploy --only hosting
   firebase deploy --only firestore:rules
   ```

---

## 2. Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com).
2. Configuración del proyecto:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. En *Environment Variables* agrega las variables `VITE_FIREBASE_*`.
4. Despliega. Vercel aplica automáticamente el rewrite SPA para Vite.

---

## 3. Netlify

1. Conecta el repositorio en [netlify.com](https://netlify.com).
2. Configuración:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Añade un `_redirects` en `public/`:

   ```
   /*    /index.html   200
   ```

   (Los archivos en `public/` se copian a `dist/` durante el build.)
4. Define las variables `VITE_FIREBASE_*` en *Site settings → Environment*.

---

## 4. Servir el build localmente (smoke test)

```bash
npm run preview
```

Abre `http://localhost:3000` y verifica que cargan los datos de Firestore.

---

## Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | API Key de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID Web |

> Nunca incluyas el `.env` real en el repositorio. Usa `.env.example` como
> plantilla y define los valores reales en la plataforma de hosting.

---

## Checklist previo a producción

- [ ] `npm run build` sin errores de tipos.
- [ ] Variables `VITE_FIREBASE_*` configuradas en el hosting.
- [ ] `firestore.rules` desplegadas y revisadas.
- [ ] (Recomendado) Habilitar **Firebase Auth** y restringir escrituras antes
      de exponer la app públicamente.
- [ ] Dominio/configuración de redirección a `index.html` para rutas SPA.
