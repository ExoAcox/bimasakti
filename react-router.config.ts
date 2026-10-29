import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from "@react-router/dev/config";

export default {
    appDirectory: "src",
    ssr: true,
    presets: [vercelPreset()],
    async prerender() {
        return [
            "/",
            "/universe",
            "/sagittarius_a",
            "/milky_way",
            "/solar_system",
            "/alpha_centauri",
            "/trappist-1",
            "/lich",
            "/toi-700",
            "/copernicus",
            "/kepler-32",
            "/kepler-47",
            "/corot-7",
            "/k2-72",
            "/wasp-47",
            "/rho_coronae_borealis",
            "/nu_scorpii",
            "/hd_110067",
            "/cervantes",
            "/toi-500",
            "/teegarden",
            "/vega",
            "/liveview/mars"
        ];
    },
} satisfies Config;
