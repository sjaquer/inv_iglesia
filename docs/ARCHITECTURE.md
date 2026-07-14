# Arquitectura — Sistema Obra

Este documento describe la arquitectura interna, el modelo de datos y los flujos
principales de la aplicación.

## Visión general

Sistema Obra es una **Single Page Application (SPA)** construida con React 19 y
Vite. Toda la persistencia se realiza en **Firebase Firestore** mediante
suscripciones en tiempo real (`onSnapshot`), de modo que cualquier cambio en la
base de datos se refleja de inmediato en la interfaz sin recargar.

No existe backend propio: el navegador se comunica directamente con Firestore
usando el SDK de Firebase. Las reglas de seguridad (`firestore.rules`) actúan
como la única capa de control de acceso.

```
┌─────────────┐      onSnapshot (tiempo real)      ┌─────────────────┐
│  React SPA  │  ───────────────────────────────▶ │  Firestore DB   │
│  (Vite)     │  ◀─────────────────────────────── │  (products,     │
│              │   addDoc / updateDoc               │   transactions,  │
│  hooks:      │  ───────────────────────────────▶ │   workers,       │
│ useInventory │                                   │   schedules)     │
│ useItinerary│                                   └─────────────────┘
└─────────────┘
```

## Estructura de capas

| Capa | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| Entrada | `src/main.tsx` | Monta React, envuelve en `ErrorBoundary`. |
| Composición | `src/App.tsx` | Estado de UI (pestaña activa, búsqueda, modales) y layout. |
| Vistas | `src/components/views/*` | Pantallas: Resumen, Movimientos, Colaboradores, Itinerario. |
| Componentes | `src/components/*` | Tabla, modales, layout (sidebar/header), UI base. |
| Hooks | `src/hooks/*` | Lógica de datos y suscripción a Firestore. |
| Librería | `src/lib/*` | Inicialización de Firebase y utilidades. |
| Modelo | `src/types.ts` | Tipos TypeScript compartidos. |

## Modelo de datos

### Product

```ts
interface Product {
  id: string;          // Document ID (Firestore)
  code: string;        // Ej. "HRR-001"
  name: string;
  description: string;
  category: Category;  // 'Herramientas' | 'Limpieza' | 'Seguridad' | ...
  condition: string;   // Estado / deficiencias
  stock: number;
  createdAt: number;   // serverTimestamp al crear
}
```

### Transaction

```ts
type TransactionType = 'IN' | 'OUT' | 'RETURN';

interface Transaction {
  id: string;
  productId: string;
  type: TransactionType;
  quantity: number;
  date: number;            // Timestamp del movimiento
  personName: string;      // Quien donó, retiró o devolvió
  conditionOnReturn?: string;
  origin?: string;         // 'Donación' | 'Compra' | 'Ajuste' | 'Otro'
  createdAt: number;
}
```

### Worker y Schedule

```ts
interface Worker {
  id: string;
  name: string;
  role: string;            // 'Operario' | 'Maestro' | ...
  phone?: string;
  createdAt: number;
}

interface Schedule {
  id: string;
  workerId: string;
  date: string;            // YYYY-MM-DD
  startTime: string;       // HH:mm
  endTime: string;         // HH:mm
  location: string;
  createdAt: number;
}
```

## Flujos principales

### 1. Carga inicial

`App` llama a `useInventory()`, que se suscribe a las colecciones `products` y
`transactions` con `orderBy('createdAt', 'desc')`. Mientras llegan los datos se
muestra un spinner; si Firebase no está configurado, se muestra un mensaje de
error en lugar del contenido.

### 2. Registro de un producto

`ProductModal` → `addProduct()` en `useInventory` → `addDoc` en `products`
con `serverTimestamp()`. La suscripción actualiza la UI automáticamente.

### 3. Movimiento de stock

`TransactionModal` → `registerTransaction()`:

1. Crea un documento en `transactions`.
2. Actualiza el `stock` del producto con `increment()`:
   - `IN` → `+quantity`
   - `OUT` → `-quantity`
   - `RETURN` → `+quantity` (y actualiza `condition` si aplica).

Las transacciones son **inmutables** (las reglas prohíben `update`/`delete`).

### 4. Itinerario

`useItinerary` se suscribe a `workers` y `schedules`. Los turnos se ordenan
en el cliente (por fecha y hora) para evitar índices compuestos en Firestore.

## Utilidades

- `cn(...)` — combina clases con `clsx` + `tailwind-merge`.
- `getCategoryColor(category)` — color de badge por categoría.
- `exportToExcel(products, transactions)` — genera un `.xlsx` con dos hojas
  (Inventario y Movimientos) y lo descarga vía `file-saver`.

## Manejo de errores

`ErrorBoundary` (`src/components/ErrorBoundary.tsx`) captura excepciones no
controladas en el árbol de React y muestra una pantalla de fallback con
opción a recargar, evitando una página en blanco en producción.
