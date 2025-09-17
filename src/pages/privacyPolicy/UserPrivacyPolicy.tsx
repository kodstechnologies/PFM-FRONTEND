import React from 'react';

const UserPrivacyPolicy: React.FC = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-700 to-amber-900 p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                        <p className="text-red-100">Last updated: 11/09/2025</p>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Introduction */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Welcome to <span className="font-semibold text-amber-900"> Priya Fresh Meats</span>, your trusted meat delivery service. We are committed to protecting
                                your privacy and ensuring the security of your personal information. This Privacy Policy
                                explains how we collect, use, disclose, and safeguard your information when you use our
                                meat delivery application and services.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Information Collection */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Information We Collect</h3>
                                <div className="space-y-3">
                                    <p className="text-gray-700">
                                        <strong className="text-amber-900">Personal Information:</strong> When you create an account, we collect your name,
                                        email address, phone number, and delivery address.
                                    </p>
                                    <p className="text-gray-700">
                                        <strong className="text-amber-900">Payment Information:</strong> We collect payment details including credit card
                                        information, billing address, and transaction history through secure payment processors.
                                    </p>
                                    <p className="text-gray-700">
                                        <strong className="text-amber-900">Order Information:</strong> Details about your meat, egg, chicken, and related
                                        product orders, preferences, and delivery instructions.
                                    </p>
                                    <p className="text-gray-700">
                                        <strong className="text-amber-900">Device Information:</strong> IP address, browser type, device type, and operating
                                        system when you use our application.
                                    </p>
                                </div>
                            </div>

                            {/* How We Use Your Information */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                    <li>Process and deliver your meat and related product orders</li>
                                    <li>Manage your account and provide customer support</li>
                                    <li>Send order confirmations, delivery updates, and receipts</li>
                                    <li>Personalize your experience with product recommendations</li>
                                    <li>Process payments and prevent fraudulent transactions</li>
                                    <li>Send promotional offers and updates (with your consent)</li>
                                    <li>Improve our services and develop new features</li>
                                </ul>
                            </div>

                            {/* Data Sharing */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Data Sharing and Disclosure</h3>
                                <div className="space-y-3">
                                    <p className="text-gray-700">
                                        <strong className="text-amber-900">Delivery Partners:</strong> We share your delivery address and contact information
                                        with our delivery personnel to fulfill your orders.
                                    </p>
                                    <p className="text-gray-700">
                                        <strong className="text-amber-900">Payment Processors:</strong> Your payment information is shared with secure
                                        third-party payment processors.
                                    </p>
                                    <p className="text-gray-700">
                                        <strong className="text-amber-900">Service Providers:</strong> We may share information with vendors who help us
                                        operate our services (e.g., cloud hosting, analytics).
                                    </p>
                                    <p className="text-gray-700">
                                        <strong className="text-amber-900">Legal Requirements:</strong> We may disclose information when required by law or
                                        to protect our rights and safety.
                                    </p>
                                </div>
                            </div>

                            {/* Data Security */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Data Security</h3>
                                <p className="text-gray-700 mb-3">
                                    We implement industry-standard security measures to protect your personal information,
                                    including:
                                </p>
                                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                    <li>SSL encryption for all data transmissions</li>
                                    <li>Secure payment processing through PCI-compliant providers</li>
                                    <li>Regular security audits and monitoring</li>
                                    <li>Access controls and authentication measures</li>
                                    <li>Secure data storage with encryption at rest</li>
                                </ul>
                            </div>

                            {/* Your Rights */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Your Rights</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-3">
                                    <li>Access and review your personal information</li>
                                    <li>Update or correct inaccurate information</li>
                                    <li>Request deletion of your account and data</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Export your data in a portable format</li>
                                    <li>Withdraw consent for data processing</li>
                                </ul>
                                <p className="text-gray-700">
                                    To exercise these rights, contact us at <span className="text-amber-900 font-medium">priyafreshmeats@gmail.com</span>
                                </p>
                            </div>

                            {/* Cookies */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">6. Cookies and Tracking</h3>
                                <p className="text-gray-700 mb-3">We use cookies and similar technologies to:</p>
                                <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-3">
                                    <li>Remember your preferences and login status</li>
                                    <li>Analyze website traffic and usage patterns</li>
                                    <li>Personalize your shopping experience</li>
                                    <li>Deliver targeted advertisements</li>
                                </ul>
                                <p className="text-gray-700">
                                    You can manage cookie preferences through your browser settings.
                                </p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-900 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-amber-900">Contact Us</h3>
                            </div>
                            <p className="text-gray-700">
                                If you have any questions about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="mt-4 space-y-2">
                                <p className="text-gray-700 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-900 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email: priyafreshmeats@gmail.com
                                </p>
                                <p className="text-gray-700 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-900 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Phone: +91 9686068687 & +91 9845052666
                                </p>
                                <p className="text-gray-700 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-900 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Address: No.175, 1st Floor, 15th Main, M C Layout, Vprov, Vijaya Nagar, Bengaluru, Karnataka, 560040
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600 text-sm">
                                By using  Priya Fresh Meats services Powered by THE BRIGHT CARS, you acknowledge that you have read and understood
                                this Privacy Policy and agree to the collection and use of your information as described.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-[#F2F3F5] text-gray-900 py-4">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
                    <p className="text-sm text-gray-900">
                        &copy; 2025 Priya Fresh Meats. Powered by <span className="font-semibold text-red-600"> THE BRIGHT CARS</span> . All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
};

export default UserPrivacyPolicy;