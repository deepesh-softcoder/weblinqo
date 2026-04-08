import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
// import logo from '../../../assets/images/logos/gradientLogoBlack.svg'
import useUserStore from "../../../stores/userStore";

const Navbar = () => {

    const { isAuthenticated } = useUserStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    
    // Define routes to show that we want to show on other pages in navbar
    const isHomePage = location.pathname === "/" || location.pathname === "/pricing" || location.pathname === "/templates" || location.pathname === "/digital-card-templates" || location.pathname === '/privacy' || location.pathname === '/terms' || location.pathname === '/contact' || location.pathname === '/signup' || location.pathname === '/login';

    // toggle moblie menu
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <div className="w-full bg-white shadow-sm sticky top-0 z-50">
            <header className="max-h-[4.5rem] py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:opacity-90 transition-opacity"
                    >
                        {/* <img
                            src={logo}
                            alt="weblinqo Logo"
                            className=" h-8"
                        /> */}
                        <h1 onClick={() => toggleMenu(!menuOpen)} className="text-2xl font-bold text-gray-900">Weblinqo</h1>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-10">
                        <>
                            <a href="/digital-card-templates" className="text-black font-semibold text-sm hover:text-primary">
                                Digital Card
                            </a>
                            <a href="/pricing" className="text-black font-semibold text-sm hover:text-primary">
                                Pricing
                            </a>
                            <a href="/templates" className="text-black font-semibold text-sm hover:text-primary">
                                Templates
                            </a>
                        </>
                    </nav>

                    {/* Auth buttons or dashboard button conditional statement  */}
                    {isAuthenticated ? <div className="hidden md:block">
                        <Link
                            to="/dashboard"
                            className="block w-full text-center bg-primary hover:bg-white border-2 border-white hover:border-primary text-white hover:text-primary font-semibold px-4 py-2 rounded-full transition-all duration-200"
                        >
                            Dashboard
                        </Link>
                    </div> :
                        <div className="hidden md:block">
                            {location.pathname === "/signup" ? <Link
                                to="/login"
                                className="block w-full text-center bg-primary hover:bg-white border-2 border-white hover:border-primary text-white hover:text-primary font-semibold px-4 py-2 rounded-full transition-all duration-200"
                            >
                                Login
                            </Link> : <Link
                                to="/signup"
                                className="block w-full text-center bg-primary hover:bg-white border-2 border-white hover:border-primary text-white hover:text-primary font-semibold px-4 py-2 rounded-full transition-all duration-200"
                            >
                                Sign up
                            </Link>}
                        </div>}

                    {/* Hamburger Icon for Mobile */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-black focus:outline-none">
                            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-4 space-y-4 absolute w-full bg-white left-0 p-4">
                        {isHomePage && <>
                            <a href="/digital-card-templates" onClick={() => setMenuOpen(false)} className="block text-black font-medium hover:text-primary">
                                Digital Card
                            </a>
                            <a href="/pricing" className="block text-black font-medium hover:text-primary">
                                Pricing
                            </a>
                            <a href="/templates" className="block text-black font-medium hover:text-primary">
                                Templates
                            </a>
                        </>
                        }

                        {/* Auth buttons or dashboard button conditional statement for mobile  */}
                        {isAuthenticated ? <div className="block md:hidden">
                            <Link
                                to="/dashboard"
                                className="block w-full text-center bg-primary hover:bg-white border-2 border-white hover:border-primary text-white hover:text-primary font-semibold px-4 py-2 rounded-full transition-all duration-200"
                            >
                                Dashboard
                            </Link>
                        </div> : <div>{location.pathname === "/signup" ? <Link
                            to="/login"
                            className="block w-full text-center bg-primary hover:bg-white border-2 border-white hover:border-primary text-white hover:text-primary font-semibold px-4 py-2 rounded-full transition-all duration-200"
                        >
                            Login
                        </Link> : <Link
                            to="/signup"
                            className="block w-full text-center bg-primary hover:bg-white border-2 border-white hover:border-primary text-white hover:text-primary font-semibold px-4 py-2 rounded-full transition-all duration-200"
                        >
                                Sign up
                            </Link>
                        }</div>}
                    </div>
                )}
            </header>
        </div>
    );
};

export default Navbar;
