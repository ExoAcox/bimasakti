
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="relative z-10 text-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <span className="text-center">
                        &copy; {currentYear} Bimasakti. Dedicated to astronomy and space exploration.
                    </span>
                    <span className="text-center">Built with React.js & React Three Fiber</span>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
