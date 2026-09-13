import { writeFileSync } from "node:fs";
import { universe_ids } from "./src/constants/index"

const baseUrl = "https://bimasakti.space";

const urls = [
    "/",
    ...universe_ids
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
        .map(
            (url) => `  <url>
    <loc>${baseUrl}${url}</loc>
  </url>`
        )
        .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", sitemap);

console.log(`Generated sitemap with ${urls.length} URLs`);