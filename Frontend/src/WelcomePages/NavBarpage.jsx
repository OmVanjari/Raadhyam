import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NavBarpage = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Reusable Active/Inactive Class
    const navLinkClasses = ({ isActive }) =>
        isActive
            ? "text-red-600 font-medium border-b-2 border-red-600 px-3 py-2 text-sm"
            : "text-white hover:text-red-600 font-medium px-3 py-2 text-sm transition duration-300";

    // Mobile Classes
    const mobileLinkClasses = ({ isActive }) =>
        `block px-4 py-3 rounded-lg font-medium ${
            isActive
                ? "text-red-600 bg-gray-900"
                : "text-gray-300 hover:text-red-600 hover:bg-gray-700"
        }`;

    return (
        <div>
            <nav className={`bg-gradient-to-r from-black via-gray-800 to-gray-900 shadow-lg fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-0'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        
                        {/* Logo */}
                        <Link to="/">
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    src="/Raadhyam.png"
                                    className="h-12 w-auto"
                                    alt="Raadhyam Logo"
                                />
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-6">

                            <NavLink to="/" className={navLinkClasses}>
                                Home
                            </NavLink>

                            <NavLink to="/About-Us" className={navLinkClasses}>
                                About Us
                            </NavLink>

                            <NavLink to="/Courses" className={navLinkClasses}>
                                Courses
                            </NavLink>

                            <NavLink to="/Notes" className={navLinkClasses}>
                                Notes
                            </NavLink>

                            <NavLink to="/Contact-Us" className={navLinkClasses}>
                                Contact Us
                            </NavLink>

                            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 text-sm font-medium">
                                <Link to="/login">Enroll Now</Link>
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`p-2 rounded-lg transition duration-300 ${isMenuOpen ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {isMenuOpen ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                        }`}>
                        <div className="px-2 pt-2 pb-2 mb-5 space-y-1 bg-gray-800 rounded-lg mt-2 border border-gray-700">

                            <NavLink to="/" className={mobileLinkClasses}>
                                Home
                            </NavLink>

                            <NavLink to="/About-Us" className={mobileLinkClasses}>
                                About Us
                            </NavLink>

                            <NavLink to="/Courses" className={mobileLinkClasses}>
                                Courses
                            </NavLink>


                            <NavLink to="/Notes" className={mobileLinkClasses}>
                                Notes
                            </NavLink>


                            <NavLink to="/Contact-Us" className={mobileLinkClasses}>
                                Contact Us
                            </NavLink>

                            <button className="w-full mt-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition duration-300 font-medium">
                                <Link to="/login" className="block w-full">
                                    Enroll Now
                                </Link>
                            </button>

                        </div>
                    </div>

                </div>
            </nav>
        </div>
    );
}

export default NavBarpage;
