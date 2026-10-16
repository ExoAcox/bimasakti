import { Html, Stars } from "@react-three/drei"
import { universes } from "@constants"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { classPosition, seo } from "@function"
import { useGalaxyStore } from "@state"
import { Galaxy } from "@components/object"
import { useEffect } from "react"

export const meta = () => seo({
    title: "Milky Way",
    description: "Milky Way"
})


const MilkyWay = () => {
    const { focus, setFocus } = useGalaxyStore()
    const { t } = useTranslation()

    const handleClick = (id: string) => {
        setFocus(id)
    }

    useEffect(() => {
        setFocus("")
    }, [setFocus])

    return (
        <>
            <Stars />
            <Galaxy onClick={() => setFocus("")}>
                {
                    universes.map((universe) => {
                        if (universe.id === "milky_way") return null

                        const { root, parent, line } = classPosition(universe.labelPosition)

                        return (
                            <group position={universe.position} key={universe.id}>
                                <Html className={clsx("-mt-1 absolute", root)} zIndexRange={[focus === universe.id ? 2 : 1, 0]} >
                                    <button className={clsx("flex cursor-pointer", parent)} onClick={() => handleClick(universe.id)}>
                                        <label className="py-px px-1 whitespace-nowrap rounded text-[8px] font-semibold text-white bg-background hover:text-blue-300 cursor-pointer"  >{t(`object.${universe.id}.name`)}</label>
                                        <div className={clsx("bg-background", line)} />
                                    </button>
                                </Html>
                                <points name={universe.id}>
                                    <bufferGeometry>
                                        <bufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0]), 3]} />
                                    </bufferGeometry>
                                    <pointsMaterial size={0.00001} color="white" />
                                </points>
                            </group>
                        )
                    })
                }
            </Galaxy>
        </>
    )
}

export default MilkyWay