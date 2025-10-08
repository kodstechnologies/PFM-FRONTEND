import React, { useState, useEffect } from 'react';
import { Phone, Email, Menu, Close, Facebook, Instagram, Twitter } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

// Define types for better type safety
interface HeaderProps { }

// Header Component
const Header: React.FC<HeaderProps> = () => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const location = useLocation();

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle mobile menu toggle
    const handleMenuClick = (): void => {
        setMobileMenuOpen(false);
    };

    // Check if a link is active
    const isActiveLink = (path: string): boolean => {
        return location.pathname === path;
    };

    return (
        <header
            className={` w-[100vw] top-0 fixed left-0  z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-0' : 'bg-white py-2'
                } `}
        >
            {/* Top bar with contact info */}
            <div className="bg-gradient-to-r from-red-800 to-red-600 text-white text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center gap-6 mb-2 sm:mb-0">
                        <a
                            href="tel:+919686068687"
                            className="flex items-center gap-2 transition-all duration-300 hover:text-red-200 hover:scale-105"
                            aria-label="Call us"
                        >
                            <Phone className="text-red-200" />
                            <span>+91 9686068687</span>
                        </a>

                        <a
                            href="mailto:priyafreshmeats@gmail.com"
                            className="flex items-center gap-2 transition-all duration-300 hover:text-red-200 hover:scale-105"
                            aria-label="Email us"
                        >
                            <Email className="text-red-200" />
                            <span>priyafreshmeats@gmail.com</span>
                        </a>
                    </div>
                    {/* Social media links */}
                </div>
            </div>

            {/* Main header with logo and navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center ">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-3 group" aria-label="Home">
                        <img
                            src="/logo.png"
                            alt="Priya Fresh Meats Logo"
                            className="h-12 w-12 object-contain transition-transform duration-500 group-hover:rotate-6"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-xl sm:text-2xl font-bold text-red-700 transition-all duration-300 group-hover:scale-105">
                                Priya Fresh Meats
                            </h1>
                            <p className="text-xs text-gray-600 hidden sm:block">Freshness Delivered to Your Doorstep</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`md:hidden bg-white shadow-xl transform transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                    } `}
                style={{ display: mobileMenuOpen ? 'block' : 'none' }}
            >
            </div>
        </header>
    );
};

export default Header;