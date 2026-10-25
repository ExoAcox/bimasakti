import {
    Navbar,
    Universe,
    Footer
} from "@components/homepage";
import { Galaxy } from "@components/object";
import SkyBox from "@components/object/SkyBox";
import { Canvas } from "@react-three/fiber";

const UniversePage = () => {
    return <div className="min-w-dvw min-h-dvh relative bg-black">
        <div className="fixed inset-0">
            <Canvas camera={{ position: [400, -300, 3] }}>
                <SkyBox path="/textures/milky_way.webp" size={1000} />
            </Canvas>
        </div>

        <Navbar />

        <div className="max-w-7xl mx-auto relative z-2 mb-16 md:mb-24 px-4 sm:px-6">
            <div className="w-full aspect-video mt-12 lg:mt-0">
                <Canvas camera={{ position: [-2, -12, -5] }}>
                    <Galaxy />
                </Canvas>
            </div>
            <Universe standalone />
        </div>

        <Footer />
    </div >
}

export default UniversePage