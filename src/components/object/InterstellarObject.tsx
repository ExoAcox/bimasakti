import type { InterstellarObject as InterstellarObjectType, Planet as PlanetType } from "@types"
import Planet from "./Planet"

const InterstellarObject = ({ data }: { data: InterstellarObjectType }) => {
    return <Planet data={data as unknown as PlanetType} />
}

export default InterstellarObject
