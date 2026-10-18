import { Star } from "@components/object"
import { seo } from "@function"

export const meta = () => seo({
    title: "Nu Scorpii",
    description: "Nu Scorpii (Jabbah) Septuple Star System"
})

const NuScorpii = () => {
    return (
        <group>
            {/* Primary AB Sub-System */}
            <Star id="nu_scorpii_aa">
                {/* Spectroscopic binary companion Ab */}
                <Star id="nu_scorpii_ab" />
                {/* Intermediate companion Ac */}
                <Star id="nu_scorpii_ac" />
                {/* Outer companion B */}
                <Star id="nu_scorpii_b" />

                {/* Wide CD Sub-System */}
                <Star id="nu_scorpii_c">
                    {/* Da binary subsystem */}
                    <Star id="nu_scorpii_da">
                        {/* Db close companion */}
                        <Star id="nu_scorpii_db" />
                    </Star>
                </Star>
            </Star>
        </group>
    )
}

export default NuScorpii
