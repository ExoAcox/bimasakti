import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    index("./pages/home.tsx"),
    layout("./components/Canvas.tsx", [
        route("milky_way", "./pages/milky_way.tsx"),
        route("solar_system", "./pages/solar_system.tsx"),
        route("alpha_centauri", "./pages/alpha_centauri.tsx"),
        route("trappist-1", "./pages/trappist-1.tsx"),
        route("lich", "./pages/lich.tsx"),
        route("toi-700", "./pages/toi-700.tsx"),
        route("copernicus", "./pages/copernicus.tsx"),
        route("kepler-32", "./pages/kepler-32.tsx"),
        route("wasp-47", "./pages/wasp-47.tsx"),
        route("rho_coronae_borealis", "./pages/rho_coronae_borealis.tsx"),
        route("nu_scorpii", "./pages/nu_scorpii.tsx"),
        route("hd_110067", "./pages/hd_110067.tsx"),
        route("cervantes", "./pages/cervantes.tsx"),
        route("toi-500", "./pages/toi-500.tsx"),
        route("teegarden", "./pages/teegarden.tsx"),
        route("vega", "./pages/vega.tsx"),
        route("sagittarius_a", "./pages/sagittarius_a.tsx"),
    ]),

    ...prefix("liveview", [
        route("mars", "./pages/liveview/mars.tsx"),
        route("moon", "./pages/liveview/moon.tsx"),
    ]),

    ...prefix("api", [
        route("objects", "./api/objects.ts"),
        route("objects/:id", "./api/object.ts"),
        route("universes", "./api/universes.ts"),
        route("universes/:id", "./api/universe.ts"),
        route("landmarks", "./api/landmarks.ts"),
        route("nations", "./api/nations.ts"),
    ]),
] satisfies RouteConfig;