# 🎬 Galería de Películas y Series

Aplicación creada con **Next.js 14 (App Router)** que combina **SSR** y **CSR** usando la API pública de **OMDb**.  
Permite listar películas populares, realizar búsquedas en tiempo real y ver los detalles de cada título en una ventana modal con diseño tipo **HBO Max**.

---

## 🚀 Tecnologías utilizadas
- **Next.js 14** (App Router)
- **React Hooks** (`useState`, `useEffect`)
- **Tailwind CSS v4**
- **OMDb API** (`https://www.omdbapi.com/`)

---

## 🎯 Características principales

### 🖥️ 1. Renderizado en el Servidor (SSR)
- La página principal muestra una lista inicial de películas populares renderizadas desde el servidor (`fetchInitial()` en `page.tsx`).

### ⚡ 2. Renderizado en el Cliente (CSR)
- El componente `PeliculasClient.tsx` usa `"use client"`.
- Búsqueda interactiva sin recargar la página.
- Resultados actualizados en tiempo real con `useEffect` y `async/await`.

### 🎞️ 3. Detalle en Modal
- Al hacer clic en una película, se muestra una ventana emergente (modal) con información detallada:
  - Título, año, género, director, actores, rating e historia.

### 🎨 4. Interfaz tipo HBO Max
- Fondo degradado oscuro, tarjetas con efecto blur y modal translúcido.
- Diseñado completamente con **Tailwind CSS** (sin CSS externo).

---

## ⚙️ Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repo>
   cd <carpeta-del-proyecto>
