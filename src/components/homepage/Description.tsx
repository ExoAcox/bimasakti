import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";




const Description = () => {
    return <div className="relative z-2 mb-46 mt-8">
        <p className="text-xl md:text-3xl xl:text-4xl text-center md:leading-12 xl:leading-14 mb-10">
            The Indonesian name for the <span className="font-extrabold bg-linear-to-br  from-white to-primary bg-clip-text text-transparent">Milky Way</span>, our home galaxy, a vast universe of stars, planets, and endless possibilities waiting to be explored.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center text-sm md:text-lg xl:text-xl font-bold gap-4 xl:gap-8 gap-y-4 flex-wrap">
            <Link to="/milky_way" className="group flex items-center gap-3 px-8 py-3.5 rounded-full font-bold bg-white text-black">
                Explore Milky Way Simulation
                <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/solar_system" className="group flex items-center gap-3 px-8 py-3.5 rounded-full font-bold bg-linear-to-br  from-white to-primary text-black">
                Explore Solar System Simulation
                <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
        </div>
    </div>
}

export default Description