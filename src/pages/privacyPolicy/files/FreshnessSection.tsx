import React, { useState, useEffect, useRef } from "react";
import {
    CheckCircle,
    LocalShipping,
    EmojiNature,
    Security,
    ArrowForward,
    Favorite,
    Star,
    TrendingUp,
    Grass
} from "@mui/icons-material";

// Replace with your image paths
import freshnessImage1 from '../../../assets/login-image/1.jpg';
import freshnessImage2 from '../../../assets/login-image/1.jpg';
import freshnessImage3 from '../../../assets/login-image/1.jpg';
import freshnessImage4 from '../../../assets/login-image/1.jpg';

function FreshnessSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="w-[100vw] px-6 lg:px-[10rem] py-16 md:py-24 bg-gradient-to-b from-white to-red-50/20">
            {/* Section Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-700 text-sm font-medium mb-6 shadow-sm border border-red-200">
                    <Grass className="mr-2" fontSize="small" /> Why Choose Priya Fresh Meats
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Freshness You Can <span className="text-red-600">Trust</span>
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-red-400 to-orange-400 mx-auto mb-6 rounded-full"></div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    At Priya Fresh Meats, we prioritize quality and freshness above all else, delivering premium meats straight from farm to your table
                </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16">
                {/* Text Content - Left Side */}
                <div className="flex-1">
                    <div className={`transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <p className="text-gray-800 mb-6 text-xl p-4 leading-relaxed">
                            Our meats are sourced daily from trusted local farms, ensuring that you
                            get the highest quality products delivered right to your doorstep.
                            Whether you're cooking for family or hosting a special event, we provide
                            hygienically packed, fresh meat that meets the highest food safety standards.
                        </p>
                    </div>

                    {/* Feature List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                        {[
                            {
                                icon: <EmojiNature className="text-red-600" fontSize="medium" />,
                                text: "Daily Sourced",
                                description: "Fresh from local farms every day",
                                delay: 200
                            },
                            {
                                icon: <Security className="text-red-600" fontSize="medium" />,
                                text: "Hygienic Processing",
                                description: "Highest standards of cleanliness",
                                delay: 300
                            },
                            {
                                icon: <LocalShipping className="text-red-600" fontSize="medium" />,
                                text: "Quick Delivery",
                                description: "At your doorstep in no time",
                                delay: 400
                            },
                            {
                                icon: <Favorite className="text-red-600" fontSize="medium" />,
                                text: "Quality Guarantee",
                                description: "100% satisfaction guaranteed",
                                delay: 500
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`flex items-start p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 group border border-gray-100 hover:border-red-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                style={{ transitionDelay: `${isVisible ? feature.delay : 0}ms` }}
                            >
                                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-3 rounded-full mr-4 group-hover:from-red-100 group-hover:to-orange-100 transition-all duration-300 shadow-sm group-hover:scale-110">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700 transition-colors">{feature.text}</h3>
                                    <p className="text-gray-600 text-sm mt-1.5">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    {/* <div className="grid grid-cols-3 gap-4 mt-12 p-6 bg-gradient-to-r from-red-50/80 to-orange-50/80 rounded-2xl shadow-sm border border-red-100 backdrop-blur-sm">
                        {[
                            { number: "500+", label: "Happy Customers", icon: <Favorite fontSize="small" className="text-red-500" /> },
                            { number: "98%", label: "Satisfaction Rate", icon: <Star fontSize="small" className="text-amber-500" /> },
                            { number: "30 min", label: "Avg. Delivery", icon: <LocalShipping fontSize="small" className="text-red-500" /> }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="flex justify-center items-center">
                                    <div className="mr-1.5">{stat.icon}</div>
                                    <div className="text-2xl font-bold text-red-700">{stat.number}</div>
                                </div>
                                <div className="text-xs text-gray-600 mt-1.5 font-medium tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div> */}

                    {/* Call to Action Button */}
                    <div className={`mt-10 transition-all duration-1000 delay-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center group">
                            Explore Our Products
                            <ArrowForward className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Image Grid - Right Side */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Main Image */}
                        <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-2xl shadow-lg">
                            <div className="aspect-w-16 aspect-h-9">
                                <img
                                    src={freshnessImage1}
                                    alt="Fresh meat selection"
                                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-white font-semibold text-lg block">Premium Selection</span>
                                    <span className="text-red-300 text-sm">Handpicked for quality</span>
                                </div>
                            </div>
                            {/* Floating tag */}
                            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center backdrop-blur-sm bg-opacity-95">
                                <Star className="mr-1" fontSize="small" /> Most Popular
                            </div>
                        </div>

                        {/* Smaller Images */}
                        {[
                            {
                                src: freshnessImage2,
                                alt: "Hygienic packaging",
                                label: "Hygienic Packaging",
                                tag: "Safe",
                                icon: <Security fontSize="small" />
                            },
                            {
                                src: freshnessImage3,
                                alt: "Farm fresh",
                                label: "Farm Fresh",
                                tag: "Local",
                                icon: <EmojiNature fontSize="small" />
                            },
                        ].map((image, index) => (
                            <div key={index} className="relative group overflow-hidden rounded-xl shadow-md">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                                    <span className="text-white text-sm font-medium bg-red-600/90 px-3 py-1.5 rounded-full flex items-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm">
                                        {image.icon && React.cloneElement(image.icon, { className: "mr-1.5 text-sm" })}
                                        {image.label}
                                    </span>
                                </div>
                                {/* Small tag */}
                                <div className="absolute top-2 right-2 bg-white/90 text-red-600 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm backdrop-blur-sm">
                                    <TrendingUp fontSize="small" className="mr-1" /> {image.tag}
                                </div>
                            </div>
                        ))}

                        {/* Fourth image */}
                        <div className="col-span-2 relative group overflow-hidden rounded-xl shadow-md">
                            <img
                                src={freshnessImage4}
                                alt="Delivery service"
                                className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-start pl-6">
                                <span className="text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center transform -translate-x-4 group-hover:translate-x-0 transition-transform duration-300">
                                    <LocalShipping className="mr-1.5" fontSize="small" /> Fast Delivery
                                </span>
                            </div>
                            {/* Animated delivery icon */}
                            <div className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-lg">
                                <CheckCircle className="text-red-600 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FreshnessSection;