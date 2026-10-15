# 🏛️ LANDRES CREATIVE — Galería de Arte 3D Virtual & Museo Interactivo

Una experiencia web 3D inmersiva en tiempo real construida con **React**, **Three.js**, **React Three Fiber (@react-three/fiber)**, **@react-three/drei** y **Vite**.

---

## ✨ Características Principales

### 1. 🖼️ Colección Curada & Esculturas 3D en Tiempo Real
- **Pinturas Clásicas y Modernas:** Obras maestras de Vincent van Gogh (*La Noche Estrellada*), Katsushika Hokusai (*La Gran Ola de Kanagawa*), Leonardo da Vinci (*Mona Lisa*), Gustav Klimt (*El Beso*), Johannes Vermeer (*La Joven de la Perla*), junto a piezas de arte generativo y digital.
- **Marcos & Focos de Museo Realistas:** Cada pintura cuenta con marco biselado, placa dorada conmemorativa y un foco cenital direccional que la ilumina.
- **Esculturas 3D Interactivas:**
  - *El Nudo Infinito del Tiempo*: Toroide de titanio iridiscente con animación de rotación armónica.
  - *Poliedro Cuántico de Cristal*: Icosaedro de cuarzo refractivo con núcleo fotoluminiscente.
  - *Espiral Áurea de la Vida*: Doble hélice de ADN basada en la proporción divina (1.618).
  - *Vórtice Cinético de Materia Oscura*: Enjambre procedural de partículas luminosas en suspensión.

### 2. 🎮 Modos de Navegación Dual
- **Exploración en Primera Persona (FPS)**:
  - `W`, `A`, `S`, `D` o Flechas: Caminar por la galería.
  - `Shift`: Correr / Paso rápido.
  - `Mouse`: Vista libre 3D con Pointer Lock.
  - `E` o `Enter`: Inspeccionar la obra más cercana.
  - `ESC`: Liberar el cursor.
  - Detección de colisiones suaves con las paredes y columnas del museo.
  - Paso cadencioso con sonido de pisadas suaves y movimiento natural de cabeza (*head-bobbing*).
- **Tour Guiado Cinematográfico**:
  - Activa el modo "Tour Guiado" para que la cámara viaje automáticamente de obra en obra.
  - Incluye narración de audio curatorial explicativa y controles para saltar a la siguiente obra.

### 3. 🎙️ Audioguía Curatorial & Síntesis de Voz
- Al inspeccionar cualquier obra o escultura, haz clic en **"Escuchar Audioguía"** para activar la voz del curador en español utilizando la Web Speech API nativa del navegador.

### 4. 🎵 Paisaje Sonoro Procedural (Web Audio API)
- Generador de audio ambiental sintetizado en tiempo real (acordes relajantes y frecuencias armónicas para simular la serenidad de un museo de clase mundial), sin depender de descargas externas de archivos MP3.

### 5. 💡 Modos de Iluminación Dinámica
- **Luz de Día Galería**: Luz cálida natural filtrada por el atrio vidriado del techo.
- **Noche Dramática**: Atmósfera oscura donde resaltan los focos cenitales y las sombras profundas.
- **Cyberpunk Neón**: Ambiente futurista con tonalidades violetas, cian y destellos prismáticos.

### 6. 🗺️ Radar & Teletransporte
- Minimapa interactivo en pantalla que permite viajar instantáneamente a cualquiera de las 4 alas:
  - *Gran Salón Principal*
  - *Ala Impresionista & Clásica*
  - *Ala Renacimiento & Retratos*
  - *Ala Contemporánea & Digital*

---

## 🚀 Cómo Ejecutar el Proyecto

Desde la terminal en `C:\Users\snipe\Coding\virtual-gallery-3d`:

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

### Para Compilar para Producción:
```bash
npm run build
npm run preview
```

---

## 🛠️ Stack Tecnológico
- **Frontend Core:** [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling:** [Vite](https://vitejs.dev/)
- **Renderizado 3D:** [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Audio:** Web Audio API & Web Speech API
- **Iconografía:** [lucide-react](https://lucide.dev/)
