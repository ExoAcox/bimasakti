import { useRef } from "react"
import type { Blackhole as BlackholeType } from "@types"
import { useSettingStore, useControlStore } from "@state"
import { useCelestial } from "@function"
import { Html } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import type { OrbitControls } from "three-stdlib"

interface Props {
    id: string
    children?: React.ReactNode
}

const Blackhole = ({ id }: Props) => {
    const labelRef = useRef<HTMLLabelElement>(null!)

    const controls = useThree((state) => state.controls as OrbitControls);

    const { sizeScale } = useSettingStore()
    const { setControl } = useControlStore()
    const data = useCelestial().getObjectById(id) as BlackholeType
    const scale = data.radius / sizeScale

    const handleClick = () => {
        if (data) setControl({ focus: data.id })
    }

    useFrame(() => {
        if (labelRef.current) {
            labelRef.current.style.visibility = controls.getDistance() <= 0.0015 ? "visible" : "hidden"
        }
    })

    if (!data) return null

    return (
        <group name={data.id} scale={scale}>
            <Html>
                <label ref={labelRef} className="invisible absolute -translate-x-1/2 -translate-y-full -mt-10 text-sm font-semibold ">Wormhole</label>
            </Html>
            <mesh
                renderOrder={10}
                onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                }}
            >
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>
            {/* <mesh scale={[1, 0.1, 1]}>
                <torusGeometry args={[5, 5, 64]} />
                <meshStandardMaterial opacity={0.5} transparent wireframe />
            </mesh> */}
        </group>
    )
}

export default Blackhole