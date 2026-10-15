import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from "@react-router/dev/config";

export default {
    appDirectory: "src",
    ssr: true,
    presets: [vercelPreset()],
    async prerender() {
        return [
            "/",
            "/sagittarius_a",
            "/milky_way",
            "/solar_system",
            "/alpha_centauri",
            "/trappist-1",
            "/lich",
            "/toi-700",
            "/copernicus",
            "/liveview/mars"
        ];
    },
} satisfies Config;
