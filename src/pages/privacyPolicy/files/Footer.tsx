import React from 'react';
import { Spa, LocalShipping, Person, Security, Description, Facebook, Twitter, Instagram, LinkedIn, YouTube } from '@mui/icons-material';

function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-16 pb-8 overflow-hidden">
            {/* Enhanced pattern overlay with animation */}
            <div
                className="absolute inset-0 opacity-10 bg-cover bg-center animate-pulse"
                style={{
                    backgroundImage:
                        'url(\'data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fillOpacity="1" fillRule="evenodd"/%3E%3C/svg%3E\')',
                }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20 animate-pulse"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand section */}
                    <div className="lg:col-span-1 group">
                        <div className="flex items-center mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-all duration-300 group-hover:scale-105">
                                P
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                <span className="block text-red-400 group-hover:text-red-300 transition-colors duration-300">
                                    Priya Fresh
                                </span>
                                <span className="text-white group-hover:text-gray-100 transition-colors duration-300">Meat</span>
                            </h2>
                        </div>
                        <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                            Delivering fresh, quality meat products straight to your doorstep with care and commitment.
                        </p>
                        <div className="flex space-x-5">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                            >
                                <Facebook fontSize="small" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                            >
                                <Twitter fontSize="small" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                            >
                                <Instagram fontSize="small" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                            >
                                <LinkedIn fontSize="small" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                            >
                                <YouTube fontSize="small" />
                            </a>
                        </div>
                    </div>

                    {/* User Links */}
                    <div className="group">
                        <h3 className="text-lg font-semibold mb-6 flex items-center text-white group-hover:text-red-300 transition-colors duration-300">
                            <Person className="mr-3 text-red-500 group-hover:text-red-400 transition-colors duration-300" /> User
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="https://pfm.kods.app/terms-and-condition"
                                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group/link hover:translate-x-2"
                                >
                                    <Description className="mr-3 text-sm opacity-70 group-hover/link:text-red-400 group-hover/link:opacity-100 transition-all duration-300" />
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://pfm.kods.app/privacy-policy"
                                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group/link hover:translate-x-2"
                                >
                                    <Security className="mr-3 text-sm opacity-70 group-hover/link:text-red-400 group-hover/link:opacity-100 transition-all duration-300" />
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Delivery Partner Links */}
                    <div className="group">
                        <h3 className="text-lg font-semibold mb-6 flex items-center text-white group-hover:text-red-300 transition-colors duration-300">
                            <LocalShipping className="mr-3 text-red-500 group-hover:text-red-400 transition-colors duration-300" /> Delivery
                            Partner
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="https://pfm.kods.app/delivery-partner/terms-and-condition"
                                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group/link hover:translate-x-2"
                                >
                                    <Description className="mr-3 text-sm opacity-70 group-hover/link:text-red-400 group-hover/link:opacity-100 transition-all duration-300" />
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://pfm.kods.app/delivery-partner/privacy-policy"
                                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group/link hover:translate-x-2"
                                >
                                    <Security className="mr-3 text-sm opacity-70 group-hover/link:text-red-400 group-hover/link:opacity-100 transition-all duration-300" />
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Quality Commitment */}
                    <div className="group">
                        <h3 className="text-lg font-semibold mb-6 flex items-center text-white group-hover:text-red-300 transition-colors duration-300">
                            <Spa className="mr-3 text-red-500 group-hover:text-red-400 transition-colors duration-300" /> Our
                            Commitment
                        </h3>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li className="flex items-start group/item hover:translate-x-1 transition-transform duration-300">
                                <span className="text-red-500 mr-3 group-hover/item:text-red-400 transition-colors duration-300 font-bold">
                                    •
                                </span>
                                <span className="group-hover/item:text-white transition-colors duration-300">Freshness Guaranteed</span>
                            </li>
                            <li className="flex items-start group/item hover:translate-x-1 transition-transform duration-300">
                                <span className="text-red-500 mr-3 group-hover/item:text-red-400 transition-colors duration-300 font-bold">
                                    •
                                </span>
                                <span className="group-hover/item:text-white transition-colors duration-300">Hygienic Processing</span>
                            </li>
                            <li className="flex items-start group/item hover:translate-x-1 transition-transform duration-300">
                                <span className="text-red-500 mr-3 group-hover/item:text-red-400 transition-colors duration-300 font-bold">
                                    •
                                </span>
                                <span className="group-hover/item:text-white transition-colors duration-300">On-Time Delivery</span>
                            </li>
                            <li className="flex items-start group/item hover:translate-x-1 transition-transform duration-300">
                                <span className="text-red-500 mr-3 group-hover/item:text-red-400 transition-colors duration-300 font-bold">
                                    •
                                </span>
                                <span className="group-hover/item:text-white transition-colors duration-300">Quality Assurance</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-8"></div>

                {/* Copyright and bottom section */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-center text-gray-400 text-sm">
                        &copy; 2025 Priya Fresh Meats. Powered by{" "}
                        <span className="font-semibold text-gray-300 hover:text-red-400 transition-colors duration-300">
                            THE BRIGHT CARS
                        </span>
                        . All rights reserved.
                    </div>

                    <div className="flex items-center text-xs text-gray-400">
                        <span className="flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse shadow-lg shadow-red-500/50"></span>
                            Freshness you can trust
                        </span>
                    </div>

                    <div className="flex space-x-6 text-gray-400 text-sm">
                        <a href="#" className="hover:text-red-400 transition-all duration-300 hover:-translate-y-0.5">
                            Sitemap
                        </a>
                        <a href="#" className="hover:text-red-400 transition-all duration-300 hover:-translate-y-0.5">
                            FAQ
                        </a>
                        <a href="#" className="hover:text-red-400 transition-all duration-300 hover:-translate-y-0.5">
                            Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer