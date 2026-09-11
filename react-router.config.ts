import type { Config } from "@react-router/dev/config";

export default {
    appDirectory: "src",
    ssr: false,
    async prerender() {
        return [
            "/",
            "/milky_way",
            "/solar_system",
            "/alpha_centauri",
            "/trappist-1",
            "/sagittarius_a"
        ];
    },
} satisfies Config;
