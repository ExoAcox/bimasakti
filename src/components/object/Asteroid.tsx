import type { Asteroid as AsteroidType, Planet as PlanetType } from "@types"
import Planet from "./Planet"

const Asteroid = ({ data }: { data: AsteroidType }) => {
    return <Planet data={data as unknown as PlanetType} />
}

export default Asteroid
