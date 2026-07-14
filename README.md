# Sistema Obra — Gestión de Inventario

Aplicación web para la **gestión de inventario, movimientos, donaciones e itinerario de personal** en obras de construcción. Permite controlar el stock de materiales, registrar entradas (donaciones/compras), salidas (préstamos/uso) y devoluciones, además de asignar turnos de trabajo al personal.

> Proyecto orientado a la obra de **Ruth**. Interfaz en español, diseño oscuro y responsive (escritorio y móvil).

---

## Características

- **Resumen general** con métricas clave: total de ítems, donantes, entradas del día y alertas de stock mínimo.
- **Inventario** con búsqueda por nombre o código, categorías y estados/deficiencias de cada producto.
- **Movimientos** (bitácora) de entradas, salidas y devoluciones en tiempo real.
- **Donantes y colaboradores** con total de donaciones e ítems aportados.
- **Itinerario** para registrar personal y asignar turnos (fecha, hora, ubicación/tarea).
- **Bitácora de actividad** (notificaciones) con alertas de stock mínimo.
- **Exportación a Excel** del inventario y los movimientos.
- **Persistencia en la nube** con Firebase Firestore (tiempo real).

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| UI | React 19 + TypeScript |
| Build | Vite 6 |
| Estilos | Tailwind CSS v4 |
| Backend / DB | Firebase Firestore (tiempo real) |
| Iconos | lucide-react |
| Fechas | date-fns (locale es) |
| Exportación | ExcelJS + file-saver |

---

## Requisitos previos

- **Node.js** 20+ (recomendado LTS).
- Una cuenta de **Firebase** con Firestore habilitado.
- Un editor de código (VS Code recomendado).

---

## Puesta en marcha

1. **Clona el repositorio** y entra a la carpeta:

   ```bash
   git clone <repo-url>
   cd Inventario_Ruth
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno.** Copia el archivo de ejemplo y completa tus credenciales de Firebase:

   ```bash
   cp .env.example .env
   ```

   Edita `.env` con los valores de tu proyecto Firebase (ver sección siguiente).

4. **Ejecuta en desarrollo:**

   ```bash
   npm run dev
   ```

   La app estará disponible en `http://localhost:3000`.

---

## Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. En **Build → Firestore Database**, crea una base de datos en modo producción.
3. En **Configuración del proyecto → Tus apps**, registra una app Web y copia el objeto de configuración.
4. Coloca esos valores en tu `.env`:

   ```env
   VITE_FIREBASE_API_KEY="AIza..."
   VITE_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="tu-proyecto"
   VITE_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
   VITE_FIREBASE_APP_ID="1:1234567890:web:abcd..."
   ```

5. **Reglas de seguridad.** El repositorio incluye `firestore.rules` con permisos de solo lectura pública y escritura controlada (sin borrado de productos/transacciones). Despliégalas desde la consola o con la CLI de Firebase.

> ⚠️ Las reglas actuales permiten lectura pública. Si la app expone información sensible, añade autenticación (Firebase Auth) y restringe las escrituras a usuarios autenticados antes de producción.

### Colecciones de Firestore

| Colección | Campos principales | Uso |
|-----------|--------------------|-----|
| `products` | `code`, `name`, `description`, `category`, `condition`, `stock`, `createdAt` | Catálogo de materiales |
| `transactions` | `productId`, `type` (IN/OUT/RETURN), `quantity`, `date`, `personName`, `origin`, `conditionOnReturn`, `createdAt` | Movimientos (inmutables) |
| `workers` | `name`, `role`, `phone`, `createdAt` | Personal |
| `schedules` | `workerId`, `date`, `startTime`, `endTime`, `location`, `createdAt` | Turnos/itinerario |

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en el puerto 3000. |
| `npm run build` | Typecheck (`tsc --noEmit`) + build de producción en `dist/`. |
| `npm run preview` | Sirve el build de producción localmente. |
| `npm run lint` | Verifica tipos con TypeScript sin emitir archivos. |
| `npm run clean` | Elimina artefactos de build (`dist`, `server.js`). |

---

## Estructura del proyecto

```
Inventario_Ruth/
├── index.html              # Entrada HTML (meta, favicon, manifest)
├── vite.config.ts          # Configuración de Vite
├── tsconfig.json           # Configuración de TypeScript
├── firebase.json           # Hosting (Firebase) + reglas
├── firestore.rules         # Reglas de seguridad de Firestore
├── public/                 # Activos estáticos (favicon, manifest, robots)
├── src/
│   ├── main.tsx            # Punto de entrada + ErrorBoundary
│   ├── App.tsx             # Layout principal y navegación
│   ├── types.ts            # Modelos de datos (Product, Transaction, Worker...)
│   ├── lib/
│   │   ├── firebase.ts     # Inicialización de Firebase
│   │   └── utils.ts        # Utilidades (cn, colores de categoría)
│   ├── hooks/
│   │   ├── useInventory.ts # Suscripción a productos/transacciones
│   │   └── useItinerary.ts # Suscripción a personal/turnos
│   ├── components/
│   │   ├── layout/         # Sidebar, Header, MobileNav, NotificationPopover
│   │   ├── ui/             # Button, Input, Select, Modal
│   │   ├── views/          # Dashboard, History, Donors, Itinerary
│   │   ├── InventoryTable.tsx
│   │   ├── ProductModal.tsx
│   │   └── TransactionModal.tsx
│   └── utils/exportExcel.ts
└── docs/
    ├── ARCHITECTURE.md     # Arquitectura y modelo de datos
    └── DEPLOYMENT.md       # Guía de despliegue
```

---

## Despliegue

La aplicación es un SPA estática que se sirve desde `dist/`. Consulta [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) para instrucciones detalladas de despliegue en Firebase Hosting, Vercel o Netlify.

---

## Documentación adicional

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitectura, estados y flujos de datos.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — guía de despliegue paso a paso.

---

## Estado y mejoras de producción

Esta versión incluye:

- ✅ Metadatos SEO (Open Graph, Twitter Card, theme-color, manifest PWA).
- ✅ `ErrorBoundary` para manejo robusto de errores en runtime.
- ✅ Favicon y `robots.txt`.
- ✅ Reglas de Firestore y configuración de hosting incluidas.
- ⚠️ **Pendiente sugerido:** añadir Firebase Auth para proteger las escrituras antes de exponer la app públicamente.

---

## Licencia

Proyecto privado. Todos los derechos reservados.
