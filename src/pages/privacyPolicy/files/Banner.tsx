import React from 'react';
import { ArrowForward, Star, LocalShipping, Security, Spa } from '@mui/icons-material';
import img from '../../../assets/login-image/11.jpg';

function Banner() {
    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-red-50 to-orange-50 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Text Content */}
                    <div className="text-center md:text-left space-y-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-2">
                            <Spa className="mr-1 text-red-500" /> 100% Natural & Fresh
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Premium Quality <span className="text-red-600">Fresh Meats</span> Delivered to Your Door
                        </h1>

                        <p className="text-lg md:text-xl text-gray-700 max-w-lg mx-auto md:mx-0">
                            Experience the finest selection of meats, carefully sourced and delivered fresh to maintain quality and taste.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                                Order Now <ArrowForward className="ml-2" />
                            </button>
                            <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                                View Products
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 pt-6">
                            <div className="flex items-center">
                                <div className="bg-red-100 p-2 rounded-full mr-3">
                                    <LocalShipping className="text-red-600 text-lg" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Free Delivery</span>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-red-100 p-2 rounded-full mr-3">
                                    <Security className="text-red-600 text-lg" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Quality Guarantee</span>
                            </div>
                        </div>

                        {/* Reviews */}
                        {/* <div className="pt-6 flex items-center justify-center md:justify-start">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="text-yellow-400" />
                                ))}
                                <span className="ml-2 text-gray-700 font-medium">4.9 (2.1k reviews)</span>
                            </div>
                        </div> */}
                    </div>

                    {/* Image Content */}
                    <div className="relative">
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
                            <img
                                src={img}
                                alt="Fresh meat selection"
                                className="w-full h-64 md:h-96 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-red-200 rounded-full opacity-30 z-0"></div>
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-red-300 rounded-full opacity-20 z-0"></div>

                        {/* Special offer badge */}
                        <div className="absolute -left-4 top-1/4 bg-red-600 text-white py-2 px-4 rounded-r-lg shadow-md">
                            <div className="text-sm font-semibold">Special Offer</div>
                            <div className="text-xs">20% Off First Order</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave decoration at bottom */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-full h-16"
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z"
                        className="fill-white"
                    ></path>
                </svg>
            </div>
        </div>
    );
}

export default Banner;