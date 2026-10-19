import type { Comet as CometType, Planet as PlanetType } from "@types"
import Planet from "./Planet"

const Comet = ({ data }: { data: CometType }) => {
    return <Planet data={data as unknown as PlanetType} />
}

export default Comet
