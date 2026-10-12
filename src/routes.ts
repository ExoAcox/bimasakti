import {
    type RouteConfig,
    route,
    index,
    layout
} from "@react-router/dev/routes";

export default [
    index("./pages/home_redirect.tsx"),
    layout("./components/Canvas.tsx", [
        route("milky_way", "./pages/milky_way.tsx"),
        route("solar_system", "./pages/solar_system.tsx"),
        route("alpha_centauri", "./pages/alpha_centauri.tsx"),
        route("trappist-1", "./pages/trappist-1.tsx"),
        route("lich", "./pages/lich.tsx"),
        route("sagittarius_a", "./pages/sagittarius_a.tsx"),
    ]),
] satisfies RouteConfig;