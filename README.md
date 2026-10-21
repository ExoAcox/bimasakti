# Bimasakti

3D interactive universe and celestial simulation web application built with **React 19**, **Three.js** (`@react-three/fiber & @react-three/drei`), **Zustand**, **React Router v8**, **Tailwind CSS v4**.

**Live:** [https://bimasakti.space](https://bimasakti.space)

---

## Quickstart

### 1. Clone the repository

```bash
git clone https://github.com/ExoAcox/bimasakti.git
cd bimasakti
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be running locally at `http://localhost:5173`.

---

## Project Structure

```text
bimasakti/
├── public/                 # Static assets (textures, 3D models, icons, geojson)
│   ├── models/             # 3D meshes (spacecraft, satellites)
│   └── textures/           # Planet surfaces, clouds, bump maps
├── src/
│   ├── api/                # React Router API endpoints (/api/objects, /api/universes, etc.)
│   ├── components/         # 2D & 3D React components
│   │   ├── Canvas.tsx      # R3F Canvas root & postprocessing pipeline
│   │   ├── Scene.tsx       # Main orbital 3D scene
│   │   ├── LiveviewScene.tsx # Planetary surface terrain mode
│   │   ├── SpaceshipScene.tsx # Spaceship flight simulator perspective
│   │   ├── homepage/       # Landing page sections
│   │   ├── panel/          # Floating glassmorphic HUD overlays
│   │   └── object/         # 3D meshes (planets, stars, rings, atmospheres)
│   ├── constants/          # Scaling constants (SCALE, TIME_SCALE) & presets
│   ├── locales/            # Localization dictionary files (en, id, de)
│   ├── pages/              # Route view components
│   │   ├── home.tsx        # Homepage
│   │   ├── milky_way.tsx   # Galaxy view
│   │   ├── solar_system.tsx# Solar system simulation
│   │   └── liveview/       # Mars & Moon surface routes
│   ├── server/             # Server-only SQLite database integration
│   │   ├── bimasakti.db    # SQLite database file
│   │   └── db.server.ts    # better-sqlite3 singleton helper
│   ├── shaders/            # Custom GLSL shaders (atmosphere glow, corona)
│   ├── utils/              # Math helpers, Zustand stores, and domain types
│   ├── root.tsx            # Root layout & HTML shell
│   ├── routes.ts           # Route registry
│   └── style.css           # Global CSS & Tailwind CSS v4 design tokens
├── Dockerfile              # Multi-stage production container build
├── package.json
└── tsconfig.json           # Path aliases (@components, @constants, @state, etc.)
```

---


## License

This project is open-source software licensed under the [MIT License](./LICENSE).
