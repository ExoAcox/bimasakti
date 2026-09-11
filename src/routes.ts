import {
    type RouteConfig,
    route,
    index,
    layout
} from "@react-router/dev/routes";

export default [
    layout("./components/Canvas.tsx", [
        index("./pages/milky_way.tsx", { id: "home" }),
        route("milky_way", "./pages/milky_way.tsx"),
        route("solar_system", "./pages/solar_system.tsx"),
        route("alpha_centauri", "./pages/alpha_centauri.tsx"),
        route("trappist-1", "./pages/trappist-1.tsx"),
        route("sagittarius_a", "./pages/sagittarius_a.tsx"),
    ]),
] satisfies RouteConfig;