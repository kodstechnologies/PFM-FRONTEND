import React from 'react';

const DeliveryPartnerTermsAndCondition: React.FC = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-8 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2"> Terms & Conditions</h1>
                        <p className="text-amber-200">Last updated: 11/09/2025</p>
                        {/* <p className="text-amber-200 mt-2">For delivery partners of  Priya Fresh Meats</p> */}
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Introduction Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                            <p className="text-gray-700 mb-4">
                                Welcome to <span className="font-semibold text-amber-900"> Priya Fresh Meats</span>'s Delivery Partner Terms and Conditions. These terms govern your relationship with  Priya Fresh Meats as a delivery partner and outline your rights and responsibilities.
                            </p>
                            <p className="text-gray-700">
                                By registering as a delivery partner and using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
                            </p>
                        </div>

                        {/* Eligibility Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Eligibility Requirements</h2>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">To become a delivery partner, you must:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Be at least 21 years of age</li>
                                    <li>Possess a valid driver's license appropriate for your vehicle type</li>
                                    <li>Have valid vehicle insurance and registration</li>
                                    <li>Pass a background check and driving record review</li>
                                    <li>Own a smartphone capable of running our delivery partner application</li>
                                    <li>Have a valid bank account for payment processing</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                Priya Fresh Meats reserves the right to verify all provided documentation and conduct additional checks as necessary. We may refuse service to anyone at our sole discretion.
                            </p>
                        </div>

                        {/* Service Provision Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Service Provision</h2>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">As a delivery partner, you agree to:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Maintain proper temperature control for perishable items during delivery</li>
                                    <li>Follow all food safety guidelines and handling procedures</li>
                                    <li>Provide professional and courteous service to customers</li>
                                    <li>Use the designated thermal bags and packaging provided</li>
                                    <li>Follow the most efficient delivery routes as suggested by our platform</li>
                                    <li>Report any delivery issues or customer concerns promptly</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                You are responsible for ensuring that deliveries are made within the specified timeframes and that products maintain their quality during transit.
                            </p>
                        </div>

                        {/* Compensation Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Compensation & Payments</h2>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">Payment Structure:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Base delivery fee per completed delivery</li>
                                    <li>Distance-based compensation for deliveries beyond standard radius</li>
                                    <li>Incentives for peak-time deliveries and high-volume periods</li>
                                    <li>Performance bonuses based on customer ratings and delivery metrics</li>
                                </ul>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">Payment Terms:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Payments are processed weekly via direct deposit</li>
                                    <li>A detailed earnings statement is available in your partner portal</li>
                                    <li>You are responsible for reporting your earnings for tax purposes</li>
                                    <li> Priya Fresh Meats will provide necessary tax documentation (e.g., 1099 forms)</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                Priya Fresh Meats reserves the right to adjust compensation rates with prior notice. Deductions may be made for lost or damaged products attributable to delivery partner negligence.
                            </p>
                        </div>

                        {/* Equipment Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Equipment & Materials</h2>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">Provided by  Priya Fresh Meats:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Thermal delivery bags to maintain product temperature</li>
                                    <li>Branded materials (optional) for vehicle identification</li>
                                    <li>Access to the delivery partner application and platform</li>
                                    <li>Customer support and operational guidance</li>
                                </ul>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">Your Responsibility:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Maintaining a reliable vehicle in good working condition</li>
                                    <li>Smartphone with data plan for using the delivery app</li>
                                    <li>Proper storage for thermal bags when not in use</li>
                                    <li>Cleaning and maintaining all provided equipment</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                You agree to return all  Priya Fresh Meats property upon termination of our agreement. Fees may be charged for unreturned or damaged equipment.
                            </p>
                        </div>

                        {/* Vehicle Requirements Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Vehicle Requirements</h2>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">Your vehicle must meet these standards:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Valid registration and inspection stickers</li>
                                    <li>Comprehensive auto insurance that covers commercial delivery activities</li>
                                    <li>Proper functioning air conditioning/heating for temperature control</li>
                                    <li>Clean interior free of odors that could affect food quality</li>
                                    <li>Sufficient space to accommodate delivery orders</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                You are responsible for all vehicle-related expenses including fuel, maintenance, insurance, and repairs.  Priya Fresh Meats is not liable for any vehicle-related incidents that occur during delivery activities.
                            </p>
                        </div>

                        {/* Insurance Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Insurance Requirements</h2>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">You must maintain:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>State-mandated auto liability insurance</li>
                                    <li>Commercial coverage for delivery activities</li>
                                    <li>Proof of insurance must be provided upon request</li>
                                    <li>Notification of any changes to your insurance coverage</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                Priya Fresh Meats maintains commercial general liability insurance, but this does not cover your personal vehicle or injuries you may sustain while performing deliveries. You are encouraged to obtain appropriate additional coverage.
                            </p>
                        </div>

                        {/* Independent Contractor Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Independent Contractor Status</h2>
                            <p className="text-gray-700 mb-4">
                                As a delivery partner, you are an independent contractor, not an employee of  Priya Fresh Meats. This relationship has important implications:
                            </p>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>You are responsible for your own taxes and withholdings</li>
                                    <li>You control your own schedule and delivery availability</li>
                                    <li> Priya Fresh Meats does not provide benefits such as health insurance or paid time off</li>
                                    <li>You are responsible for your own expenses related to delivery activities</li>
                                    <li>You have the right to work for other delivery services simultaneously</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                You acknowledge that this independent contractor relationship is fundamental to these Terms and Conditions and expressly agree to this classification.
                            </p>
                        </div>

                        {/* Confidentiality Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Confidentiality</h2>
                            <p className="text-gray-700 mb-4">
                                During your engagement with  Priya Fresh Meats, you may have access to confidential information including:
                            </p>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Customer personal information and delivery addresses</li>
                                    <li>Business operations and delivery processes</li>
                                    <li>Pricing structures and promotional strategies</li>
                                    <li>Proprietary technology and app functionality</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                You agree to maintain the confidentiality of this information during and after your engagement with  Priya Fresh Meats. Unauthorized disclosure may result in termination and legal action.
                            </p>
                        </div>

                        {/* Termination Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Termination</h2>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">Either party may terminate this agreement:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>With 14 days written notice without cause</li>
                                    <li>Immediately for material breach of these terms</li>
                                    <li>Immediately for violation of food safety standards</li>
                                    <li>Immediately for fraudulent activity or misrepresentation</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                Upon termination, you must return all  Priya Fresh Meats property and cease using all platform access. Outstanding payments will be processed according to our standard payment schedule.
                            </p>
                        </div>

                        {/* Limitation of Liability Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Limitation of Liability</h2>
                            <p className="text-gray-700 mb-4">
                                Priya Fresh Meats's liability to you as a delivery partner is limited as follows:
                            </p>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>We are not liable for lost profits or indirect damages</li>
                                    <li>Our total liability for any claim is limited to your earnings in the previous 30 days</li>
                                    <li>We are not liable for incidents arising from your negligence</li>
                                    <li>We are not responsible for customer actions or behaviors</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                You agree to indemnify and hold harmless  Priya Fresh Meats from any claims arising from your delivery activities, except where directly caused by our gross negligence.
                            </p>
                        </div>

                        {/* Dispute Resolution Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Dispute Resolution</h2>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">Governing Law and Jurisdiction:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>These Terms are governed by the laws of the state where  Priya Fresh Meats is headquartered</li>
                                    <li>Most disputes will be resolved through informal negotiation first</li>
                                    <li>If informal resolution fails, mediation will be attempted</li>
                                    <li>Binding arbitration may be required for certain disputes</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                You agree to attempt resolution through these channels before pursuing litigation. Class action lawsuits are waived as part of this agreement.
                            </p>
                        </div>

                        {/* Changes to Terms Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Changes to Terms</h2>
                            <p className="text-gray-700 mb-4">
                                Priya Fresh Meats may modify these Terms and Conditions from time to time. Changes will be:
                            </p>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Posted in the delivery partner application</li>
                                    <li>Communicated via email to registered partners</li>
                                    <li>Effective 14 days after notification</li>
                                    <li>Applicable to all delivery activities after the effective date</li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                Your continued use of the platform after changes take effect constitutes acceptance of the modified terms. If you do not agree to the changes, you must cease using our services.
                            </p>
                        </div>

                        {/* Contact Information Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Contact Information</h2>
                            <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-amber-900 mb-2">For questions about these Terms:</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                    <li>
                                        <strong>Email:</strong> priyafreshmeats@gmail.com
                                    </li>
                                    <li>
                                        <strong>Phone:</strong> +91 9686068687 & +91 9845052666
                                    </li>
                                    <li>
                                        <strong>Address:</strong> No.175, 1st Floor, 15th Main, M C Layout, Vprov, Vijaya Nagar, Bengaluru, Karnataka, 560040
                                    </li>
                                    <li>
                                        <strong>In-app:</strong> Use the Help section in your delivery partner application
                                    </li>
                                </ul>
                            </div>
                            <p className="text-gray-700">
                                For urgent delivery-related issues during operations, please use the dedicated support line available in the application.
                            </p>
                        </div>

                        {/* Acceptance Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="bg-amber-100 p-4 rounded-lg">
                                <h3 className="font-semibold text-amber-900 mb-2">Acknowledgement of Terms</h3>
                                <p className="text-gray-700">
                                    By registering as a delivery partner and using the  Priya Fresh Meats platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. You affirm that you meet all eligibility requirements and will comply with all provisions outlined herein.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-[#FEF4CA] text-gray-900 py-4">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
                    <p className="text-sm text-gray-900">
                        &copy; 2025 Priya Fresh Meats. Powered by <span className="font-semibold text-red-600"> THE BRIGHT CARS</span> . All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
};

export default DeliveryPartnerTermsAndCondition;