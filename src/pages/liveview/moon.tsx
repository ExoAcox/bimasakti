import { Earth, Sun, Terrain } from "@components/liveview/moon"
import LiveviewCanvas from "@components/LiveviewCanvas"
import LiveviewScene from "@components/LiveviewScene"
import { SkyBox } from "@components/object"
import { seo } from "@function"
import { Suspense } from "react"
import { MathUtils, Vector3 } from "three"

export const meta = () =>
    seo({
        title: "Moon",
        description: "Moon Terrain Simulation",
    })

// Ground elevation at center (0, 0) with scale 100 is ~1.65
const TERRAIN_SCALE = 100
const EYE_HEIGHT = 1.8
const CAMERA_ORIGIN = new Vector3(0, 1.65 + EYE_HEIGHT, 0)
const SUN_POSITION: [number, number, number] = [-90, 70, -50]
const EARTH_POSITION: [number, number, number] = [60, 45, 80]

const Moon = () => {
    return (
        <LiveviewCanvas
            id="moon"
            camera={{
                position: [CAMERA_ORIGIN.x, CAMERA_ORIGIN.y, CAMERA_ORIGIN.z],
                fov: 65,
                near: 0.1,
                far: 10000,
            }}
            userInterface={null}
        >
            <SkyBox size={10000} rotation={[MathUtils.degToRad(20), MathUtils.degToRad(120), 0]} />

            <Sun position={SUN_POSITION} />

            <Suspense fallback={null}>
                <Earth position={EARTH_POSITION} />
            </Suspense>

            {/* Subtle ambient bounce and earthshine in vacuum space */}
            <ambientLight intensity={0.25} color="#cbd5e1" />
            <hemisphereLight
                args={["#b0c4de", "#1e2229", 0.35]}
                position={[0, 50, 0]}
            />

            <Terrain scale={TERRAIN_SCALE} />
            <LiveviewScene position={CAMERA_ORIGIN} />
        </LiveviewCanvas>
    )
}

export default Moon
