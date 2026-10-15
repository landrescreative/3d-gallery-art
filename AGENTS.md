# 🏛️ AGENTS.md — Virtual Gallery 3D (Landres Creative Museum)

> Guía técnica y operativa para Agentes de Inteligencia Artificial y desarrolladores que interactúan, extienden o mantienen este repositorio.

---

## 1. 📋 Resumen Ejecutivo del Proyecto

- **Nombre:** `virtual-gallery-3d`
- **Concepto:** Galería de arte y museo interactivo 3D en tiempo real para la web, diseñado como espacio museístico y portafolio interactivo inmersivo de **Landres Creative**.
- **Stack Tecnológico:**
  - **Framework UI:** React 18 (`react`, `react-dom`) + TypeScript 5/6
  - **Bundler & Build Tool:** Vite 5
  - **Gráficos 3D & WebGL:** Three.js (`three`), React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
  - **Audio & Voz:** Web Audio API (paisaje sonoro procedimental sintetizado) + Web Speech API (audioguía curatorial)
  - **Controles Móviles:** `nipplejs` (joystick virtual táctil)
  - **Iconografía & Estilos:** `lucide-react`, CSS3 modular / variables de diseño futurista-museístico

---

## 2. 🏗️ Arquitectura de Directorios

```text
virtual-gallery-3d/
├── index.html                   # Entry point HTML con viewport configurado para WebGL
├── package.json                 # Dependencias, scripts de build y config de Vite
├── tsconfig.json                # Configuración TypeScript estricta
├── vite.config.ts               # Plugins de Vite (React) con manualChunks optimizados
├── public/                      # Assets estáticos servidos directamente
│   ├── audio/                   # Pistas de audio (ej. lofi-study.mp3)
│   ├── models/                  # Modelos 3D GLTF/GLB optimizados (conejomodelo, skincare-crema, etc.)
│   ├── projects/                # Renders y capturas de obras (WebP/JPG de alta resolución)
│   └── textures/                # Mapas HDRI de entorno (park_scenic_4k/2k, dikhololo_night, clear_sky)
└── src/
    ├── main.tsx                 # Montaje de React en el DOM
    ├── App.tsx                  # Orquestador principal de estado global, modos visuales y UI
    ├── style.css                # Estilos globales de la interfaz (HUD, modales, temas, preloader)
    ├── components/
    │   ├── 3d/                  # Componentes dentro del Canvas R3F
    │   │   ├── GalleryScene.tsx         # Configuración del Canvas, cámaras, luces y montaje de salas
    │   │   ├── GalleryArchitecture.tsx  # Geometría arquitectónica: muros, claraboyas, pisos, columnas
    │   │   ├── GalleryEnvironment.tsx   # IBL (Image-Based Lighting) y entorno HDRI dinámico
    │   │   ├── ArtworkFrame.tsx         # Cuadros clásicos, monitores, pantallas de cine y navegadores flotantes
    │   │   ├── SculpturePedestal.tsx    # Pedestales museísticos y renderizado de esculturas GLTF/procedurales
    │   │   ├── PlayerController.tsx     # Controlador FPS, colisiones AABB + cilíndricas, head-bobbing y zoom
    │   │   └── CinematicTour.tsx        # Interpolación de cámara para el tour guiado automático
    │   └── ui/                  # Overlays DOM superpuestos al canvas 3D
    │       ├── TopNav.tsx               # Barra superior: modos de luz, calidad gráfica, tour y calibrador visual
    │       ├── HUD.tsx                  # Retícula central, pistas de teclado/mouse, estado de inspección
    │       ├── InspectModal.tsx         # Ficha técnica, audioguía con voz TTS, carrusel y botón de conversión
    │       ├── StudioOrbitInspector.tsx # Visualizador 3D orbital secundario (modos Clay/MatCap)
    │       ├── MobileControls.tsx       # Controles táctiles (joystick izquierdo + touchpad de giro)
    │       ├── VisualDebugPanel.tsx     # Panel de calibración visual (tecla 'V') con exportador de presets
    │       └── Preloader.tsx            # Pantalla de carga y transiciones de calidad gráfica
    ├── data/
    │   ├── artworks.ts          # Base de datos de obras, esculturas y salas temáticas
    │   └── visualPresets.ts     # Presets de iluminación (Noche, Galería, Atardecer, Nórdico, etc.)
    ├── types/
    │   ├── gallery.ts           # Interfaces TypeScript (Artwork, Sculpture, LightingMode, GraphicsQuality)
    │   └── visualSettings.ts    # Configuración de renderizado PBR, sol, niebla y HDRI
    └── utils/
        ├── audio.ts             # Web Audio API: sintetizador armónico reactivo al espacio y pisadas
        ├── canvasTextures.ts    # Generador procedimental de texturas (parquet, placas doradas, navegadores)
        └── zoomState.ts         # Estado del zoom táctico de cámara (Click derecho)
```

---

## 3. 🏛️ Estructura Espacial & Distribución de Salas

El museo está distribuido sobre un plano ortogonal continuo con coordenadas 3D milimétricamente calibradas:

| Sala / Ala | Posición Spawn / Centro | Temática & Descripción |
| :--- | :--- | :--- |
| **Gran Atrio Central** | `[0, 1.7, 5]` | Recepción, columnas monumentales de mármol, claraboya cenital y video-wall de manifiesto visual de Landres Creative. |
| **Galería de Diseño Gráfico & Edición de Foto** | `[-14, 1.7, 3.8]` (Ala Oeste) | Paredes cálidas, marcos biselados flotantes. Contiene fotocomposición, carteles publicitarios y diseño editorial. |
| **Pabellón de UI/UX, Web & Plataformas** | `[14, 1.7, 3.8]` (Ala Este) | Entorno tecnológico contemporáneo. Obras expuestas en monitores flotantes, laptops 3D, tabletas y teléfonos de titanio. |
| **Sala 3D, CGI & Escultura** | `[0, 1.7, -11]` (Ala Norte) | Techo de doble altura con tragaluz difuso y ventanal panorámico hacia el jardín exterior. Alberga esculturas y modelos GLTF en pedestales con MatCaps, más pantallas de cine panorámicas. |

---

## 4. ⚙️ Subsistemas Técnicos Críticos

### 4.1. Renderizado & Gestión de Rendimiento (60 FPS Target)
- **Adaptabilidad a Dispositivos:** Detección de dispositivos móviles mediante `isMobileDevice`.
- **DPR Dinámico:**
  - `bajo`: `[1.0, 1.0]` (Móvil) o `[0.85, 1.0]` (Desktop económico).
  - `medio`: `[1.0, 1.5]` (Equilibrado para pantallas Retina/HiDPI).
  - `alto`: `[1.0, 2.0]` con sombras en 2048px y MSAA activo.
- **Optimización de Materiales Vidriados:** El material de cristal físico con `transmission > 0` genera un render target full-screen extra por cuadro. En modo móvil o calidad baja, se conmuta automáticamente a alpha blending estándar para evitar cuellos de botella en GPUs móviles.
- **Precalentamiento de Shaders:** Se incluye `<Preload all />` en `GalleryScene.tsx` para compilar la totalidad de los shaders antes de comenzar la navegación y eliminar micro-tirones (*jank*).

### 4.2. Motor de Colisiones Analíticas
En lugar de depender de raycasting intensivo por frame, `PlayerController.tsx` implementa un resolvedor geométrico híbrido ultrarrápido:
1. **Columnas Monolíticas (`PILLARS`):** Comprobación euclidiana `dx² + dz² < r²`.
2. **Mobiliario, Mesas y Pedestales (`BOX_OBSTACLES`):** Comprobación de cajas de colisión AABB (*Axis-Aligned Bounding Box*) con tolerancia `PLAYER_RADIUS = 0.40`.

### 4.3. Texturas Procedimentales en Canvas (`src/utils/canvasTextures.ts`)
Para minimizar la carga de red y asegurar máxima nitidez en cualquier resolución, las siguientes texturas se sintetizan en tiempo real mediante un HTML Canvas 2D antes de convertirse en `THREE.CanvasTexture`:
- Parquet de roble escandinavo con vetas de madera orgánicas.
- Placas museísticas conmemorativas en latón y tipografía grabada.
- Barra de navegador macOS / Safari para obras web.
- Carteles de señalización arquitectónica direccional.
- MatCaps estilizados (`ceramic`, `wax`, `metallic`, `clay`).

### 4.4. Audio Adaptativo & Curaduría de Voz
- **Sintetizador Web Audio:** Genera acordes continuos de relajación con frecuencias afinadas por sala (Atrio en Cmaj9, Sala 3D en D menor, Galería Gráfica en Fmaj7, UI/UX en Emaj9).
- **Pisadas Sensibles a la Superficie:** El paso cadencioso (*footsteps*) modula el filtro biquad y la envolvente de ganancia dependiendo del suelo pisado (`wood`, `stone`, `tech`, `cyber`).
- **Audioguía (Web Speech API):** Al presionar "Escuchar Audioguía", el sistema utiliza síntesis de voz nativa en español (`speechSynthesis`) leyendo la ficha curatorial redactada para cada obra.

### 4.5. Sistema de Inspección & Visualizador Orbital Studio
- Al pulsar `E` o hacer clic en una obra cercana, se despliega `InspectModal.tsx`.
- Para esculturas 3D, se activa `StudioOrbitInspector.tsx`, un canvas Three.js secundario con controles orbitales de cámara, alternancia entre materiales realistas y modo escultura en arcilla (*Clay Render*), control de rotación y zoom de precisión.

### 4.6. Panel de Calibración Visual en Vivo (Tecla `V`)
- Pulsar `V` en cualquier momento abre `VisualDebugPanel.tsx`.
- Permite ajustar sol (azimut, elevación, intensidad), HDRI, rotación de entorno, niebla volumétrica, exposición y rugosidad PBR.
- Los ajustes pueden guardarse en `localStorage` o exportarse como código TypeScript para incluirlos en `visualPresets.ts`.

---

## 5. 🛠️ Protocolos de Desarrollo para Agentes

### 5.1. Reglas para Añadir Nuevas Obras (`Artwork`)
Para incorporar una nueva pieza en `src/data/artworks.ts`:
1. Asegurarse de que las imágenes se coloquen en `public/projects/` en formato `.webp` optimizado.
2. Definir el objeto respetando la interfaz `Artwork`:
   ```typescript
   {
     id: 'nombre-unico',
     title: 'Título de la Obra',
     artist: 'Landres Creative',
     year: '2025',
     period: 'Disciplina o Especialidad',
     medium: 'Técnica / Software utilizado',
     dimensions: 'Dimensiones o resolución',
     description: 'Descripción conceptual para el modal de inspección',
     curatorNotes: 'Notas curatoriales para la audioguía',
     imageUrl: '/projects/nombre-archivo.webp',
     galleryImages: ['/projects/nombre-archivo.webp'],
     fallbackColor1: '#111827',
     fallbackColor2: '#38bdf8',
     aspectRatio: 1.777, // width / height
     position: [x, y, z], // Coordenadas 3D en la pared adecuada
     rotation: [0, yRad, 0], // Orientación respecto a la pared
     room: 'Nombre de la Sala',
     size: [ancho, alto], // Escala en unidades 3D
     displayType: 'classic_frame' | 'cinema_screen' | 'floating_browser' | 'titanium_phone',
     videoUrl: '/videos/nombre-reel.mp4' // Opcional: activa VideoTexture en bucle y reproductor en el modal
   }
   ```
3. Si la obra incluye colisiones físicas (como una mesa o pedestal), registrar el collider AABB correspondiente en `BOX_OBSTACLES` dentro de `PlayerController.tsx`.

### 5.2. Reglas para Añadir Esculturas / Modelos 3D (`Sculpture`)
1. Guardar el archivo `.glb` optimizado en `public/models/`.
2. Utilizar compresión Draco o Meshopt cuando el modelo supere los 2 MB.
3. Configurar en `SCULPTURES` (`src/data/artworks.ts`):
   - `modelUrl`: ruta relativa en `public/` (ej. `/models/pieza.glb`).
   - `modelScale`: factor de escala para mantener proporción humana.
   - `pedestalHeight`: altura del pedestal (habitualmente `1.15m` o `0.82m` para mesas arquitectónicas).
   - `matcapStyle`: estilo de acabado de estudio para el inspector orbital (`ceramic`, `wax`, `metallic`, etc.).

### 5.3. Buenas Prácticas de Codificación en este Repositorio
- **Nunca romper la experiencia móvil:** Todo cambio en cámaras, controles o eventos debe considerar `isMobile` y la compatibilidad con toques táctiles.
- **Mantener 60 FPS en el render loop:** Evitar cálculos pesados, asignaciones de memoria o creación de objetos Three.js (`new THREE.Vector3()`) dentro de `useFrame`. Reutilizar vectores y matrices mediante referencias estáticas (`useRef` o variables externas).
- **Consistencia de Pointer Lock:** Cuando un modal (`InspectModal`, `VisualDebugPanel`) se abra, debe liberarse el puntero (`document.exitPointerLock()`). Al cerrarlo, el foco debe restituirse limpiamente al canvas.
- **Integridad Tipográfica y Estética:** Mantener la estética museística minimalista, fondos con desenfoque de cristal (`backdrop-filter: blur()`), bordes sutiles en `rgba(255,255,255,0.1)` y paletas cromáticas sobrias.

---

## 6. 🚀 Comandos y Tareas Comunes

```bash
# Iniciar servidor de desarrollo en local (puerto por defecto: 5173)
npm run dev

# Verificar tipado TypeScript y compilar bundle de producción
npm run build

# Previsualizar el bundle compilado en dist/
npm run preview
```

### Pruebas Automatizadas & Captura de Pantalla
- El repositorio cuenta con scripts de prueba basados en Puppeteer (`test-joystick.cjs`) para validar visualmente la galería y los controles táctiles sin necesidad de intervención manual.
