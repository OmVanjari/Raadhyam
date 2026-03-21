import React from 'react'
import { Link } from 'react-router-dom';

const FooterPage = () => {
    return (
        <div>
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div>

                            <Link to="/" ><img src="/Raadhyam.png" alt="Raadhyam Logo" className="h-16 sm:h-20 mb-3 sm:mb-4" />
                            </Link>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Teaching music with heart and passion. Online & offline classes available for all instruments.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
                            <ul className="space-y-1 sm:space-y-2 text-gray-400">
                                <li><a href="/" className="hover:text-white transition duration-300 text-sm sm:text-base">Home</a></li>
                                <li><a href="/About-Us" className="hover:text-white transition duration-300 text-sm sm:text-base">About Us</a></li>
                                <li><a href="/Contact-Us" className="hover:text-white transition duration-300 text-sm sm:text-base">Courses</a></li>
                                <li><a href="/Notes" className="hover:text-white transition duration-300 text-sm sm:text-base">Notes</a></li>
                                <li><a href="/Contact" className="hover:text-white transition duration-300 text-sm sm:text-base">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h4>
                            <ul className="space-y-1 sm:space-y-2 text-gray-400">
                                <li className="text-sm sm:text-base">Email: raadhyammusicals@gmail.com</li>
                                <li className="text-sm sm:text-base">Address: Ashiyana PT. Deen, Shop no.04, Sector 7, Dayal Upadhyay Puram, Agra, Uttar Pradesh 282007</li>
                                <li className="text-sm sm:text-base">Online Courses: Available Worldwide</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Follow Us</h4>
                            <div className="flex space-x-3">
                                <a href="https://www.instagram.com/learnwith_raadhyam/" className="text-gray-400 hover:text-white transition duration-300">
                                    <span className="text-sm sm:text-base">Instagram</span>
                                </a>
                                <a href="https://www.youtube.com/@raadhyammusicacademy" className="text-gray-400 hover:text-white transition duration-300">
                                    <span className="text-sm sm:text-base">YouTube</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
                        <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} Raadhyam Musical Classes. All rights reserved. | Learn with ❤️</p>
                    </div>
                </div>
            </footer>   
        </div>
    )
}

export default FooterPage