import type { Planet as PlanetType, Satellite as SatelliteType } from "@types"
import Planet from "./Planet"




const Satellite = ({ data }: { data: SatelliteType }) => {
    return <Planet data={data as unknown as PlanetType} />
}

export default Satellite