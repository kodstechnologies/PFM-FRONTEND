import React from 'react';

const DeliveryPartnerPrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                    <p className="text-amber-200">Last updated: 08/09/2025</p>
                    {/* <p className="text-amber-200 mt-2">For delivery partners of  Priya Fresh Meat</p> */}
                </div>

                <div className="p-6 md:p-8">
                    {/* Introduction Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 mb-4">
                            Welcome to <span className="font-semibold text-amber-900"> Priya Fresh Meat</span>'s Delivery Partner Privacy Policy. This policy explains how we collect, use, and protect the personal information of our delivery partners.
                        </p>
                        <p className="text-gray-700 mb-4">
                            As a delivery partner, you play a crucial role in our service by ensuring timely and safe delivery of meat, poultry, eggs, and related products to our customers. This privacy policy applies specifically to individuals who provide delivery services through our platform.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Scope of This Policy:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>This policy applies to all delivery partners registered with  Priya Fresh Meat</li>
                                <li>It covers information collected during the application process and throughout your engagement with us</li>
                                <li>It explains how we use location data during delivery operations</li>
                                <li>It outlines your rights regarding your personal information</li>
                            </ul>
                        </div>
                        <p className="text-gray-700">
                            By registering as a delivery partner and using our platform, you consent to the practices described in this Privacy Policy. We may update this policy from time to time, and we will notify you of any significant changes.
                        </p>
                    </div>

                    {/* Information Collected Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
                        <p className="text-gray-700 mb-4">
                            We collect various types of information to facilitate delivery operations, ensure security, and process payments. This includes:
                        </p>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Personal Identification Information:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Full name, date of birth, and government-issued ID numbers</li>
                                <li>Contact information (phone number, email address, residential address)</li>
                                <li>Photograph for your delivery partner profile</li>
                                <li>Background check and driving record information</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Vehicle Information:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Vehicle make, model, year, and color</li>
                                <li>License plate number and vehicle registration details</li>
                                <li>Vehicle insurance information</li>
                                <li>Vehicle inspection reports</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Operational Information:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Location data during active deliveries</li>
                                <li>Delivery history and performance metrics</li>
                                <li>Ratings and feedback from customers</li>
                                <li>Communication records with customers and support team</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-amber-900 mb-2">Financial Information:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Bank account details for payment processing</li>
                                <li>Tax identification information</li>
                                <li>Earnings and payment history</li>
                            </ul>
                        </div>
                    </div>

                    {/* Information Use Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-700 mb-4">
                            We use the information we collect for various purposes related to your role as a delivery partner:
                        </p>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Service Operations:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>To verify your identity and eligibility to provide delivery services</li>
                                <li>To connect you with delivery opportunities in your area</li>
                                <li>To facilitate navigation and optimize delivery routes</li>
                                <li>To provide customer support and resolve issues</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Safety and Security:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>To conduct background checks and ensure safety compliance</li>
                                <li>To monitor and improve delivery service quality</li>
                                <li>To investigate and address safety incidents or complaints</li>
                                <li>To prevent fraud and protect against illegal activities</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Payment and Financial Processing:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>To calculate and process your earnings</li>
                                <li>To provide tax documents and financial reports</li>
                                <li>To resolve payment-related issues</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-amber-900 mb-2">Communication:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>To send important notices about policy changes</li>
                                <li>To provide information about delivery opportunities</li>
                                <li>To share tips for improving your delivery performance</li>
                                <li>To notify you about promotions or incentive programs</li>
                            </ul>
                        </div>
                    </div>

                    {/* Information Sharing Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Information Sharing</h2>
                        <p className="text-gray-700 mb-4">
                            We may share your information with third parties in the following circumstances:
                        </p>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">With Customers:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Your first name and photograph when you are assigned to a delivery</li>
                                <li>Your vehicle information to help customers identify you</li>
                                <li>Your location data (during active deliveries only) to show estimated arrival time</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">With Service Providers:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Background check providers to verify your eligibility</li>
                                <li>Payment processors to facilitate your earnings</li>
                                <li>Mapping and navigation services to optimize delivery routes</li>
                                <li>Cloud storage providers for data hosting</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-amber-900 mb-2">For Legal and Safety Reasons:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>When required by law, regulation, or legal process</li>
                                <li>To protect the rights, property, or safety of  Priya Fresh Meat, our users, or the public</li>
                                <li>To investigate fraud or respond to a government request</li>
                                <li>In connection with a merger, acquisition, or sale of all or a portion of our assets</li>
                            </ul>
                        </div>
                    </div>

                    {/* Data Security Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Data Security</h2>
                        <p className="text-gray-700 mb-4">
                            We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.
                        </p>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Security Measures:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security assessments and vulnerability testing</li>
                                <li>Access controls limiting who can access your personal data</li>
                                <li>Secure authentication methods for app access</li>
                                <li>Regular training for our staff on data protection</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-amber-900 mb-2">Your Role in Security:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Keep your login credentials confidential</li>
                                <li>Use strong, unique passwords for your account</li>
                                <li>Log out of the app when not in use, especially on shared devices</li>
                                <li>Notify us immediately if you suspect any unauthorized access</li>
                            </ul>
                        </div>
                    </div>

                    {/* Data Retention Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Data Retention</h2>
                        <p className="text-gray-700 mb-4">
                            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for.
                        </p>

                        <div className="bg-amber-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-amber-900 mb-2">Retention Periods:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Account information: Retained for 3 years after account deactivation for legal and tax purposes</li>
                                <li>Delivery records: Retained for 2 years for customer service and dispute resolution</li>
                                <li>Financial information: Retained for 7 years to comply with tax laws</li>
                                <li>Location data: Generally deleted within 90 days, except when needed for specific investigations</li>
                            </ul>
                        </div>
                    </div>

                    {/* Your Rights Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Your Rights</h2>
                        <p className="text-gray-700 mb-4">
                            As a delivery partner, you have certain rights regarding your personal information:
                        </p>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Your Data Protection Rights:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li><strong>Access:</strong> The right to request copies of your personal data</li>
                                <li><strong>Rectification:</strong> The right to request correction of inaccurate information</li>
                                <li><strong>Erasure:</strong> The right to request deletion of your personal data</li>
                                <li><strong>Restriction:</strong> The right to request limiting how we use your data</li>
                                <li><strong>Portability:</strong> The right to request transfer of your data to another organization</li>
                                <li><strong>Objection:</strong> The right to object to certain processing activities</li>
                            </ul>
                        </div>

                        <p className="text-gray-700">
                            If you wish to exercise any of these rights, please contact us using the details provided in the "Contact Us" section. We may need to verify your identity before processing your request.
                        </p>
                    </div>

                    {/* Contact Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Contact Us</h2>
                        <p className="text-gray-700 mb-4">
                            If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:
                        </p>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Contact Information:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                <li>
                                    <strong>Email:</strong>  priyafreshmeats@gmail.com
                                </li>
                                <li>
                                    <strong>Phone:</strong>+91 9686068687 & +91 9845052666
                                </li>
                                <li>
                                    <strong>Address:</strong>  No.175, 1st Floor, 15th Main, M C Layout, Vprov, Vijaya Nagar, Bengaluru, Karnataka, 560040
                                </li>
                                <li>
                                    <strong>In-app:</strong> Use the Help section in your delivery partner app
                                </li>
                            </ul>
                        </div>

                        <p className="text-gray-700">
                            We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this privacy policy. If you have any questions about this privacy policy, including any requests to exercise your legal rights, please contact the DPO using the details above.
                        </p>
                    </div>

                    {/* Acceptance Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-amber-100 p-4 rounded-lg">
                            <h3 className="font-semibold text-amber-900 mb-2">Acknowledgement</h3>
                            <p className="text-gray-700">
                                By using the  Priya Fresh Meatsdelivery partner platform, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and sharing of your information as described herein.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryPartnerPrivacyPolicy;