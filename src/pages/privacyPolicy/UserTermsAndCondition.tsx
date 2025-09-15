// import React from 'react';

// const UserTermsAndCondition: React.FC = () => {
//     return (
//         <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-8 px-4">
//             <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-amber-800 to-red-800 p-8 text-center">
//                     <div className="flex justify-center mb-4">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                         </svg>
//                     </div>
//                     <h1 className="text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
//                     <p className="text-amber-200">Last updated: 08/09/2025</p>
//                 </div>

//                 <div className="p-6 md:p-8">
//                     {/* Introduction Section */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
//                         <p className="text-gray-700 mb-4">
//                             Welcome to <span className="font-semibold text-amber-900"> Priya Fresh Meats</span>. These Terms and Conditions govern your use of our meat delivery service and website. By accessing or using our service, you agree to be bound by these Terms.
//                         </p>
//                         <p className="text-gray-700 mb-4">
//                              Priya Fresh Meats provides fresh meat, poultry, eggs, and related products through our online platform and delivery service. These Terms apply to all users of the service, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
//                         </p>
//                         <p className="text-gray-700">
//                             Please read these Terms carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
//                         </p>
//                     </div>

//                     {/* Account Terms Section */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Account Terms</h2>
//                         <p className="text-gray-700 mb-4">
//                             To access and use certain features of  Priya Fresh Meats, you may be required to register for an account. You must be at least 18 years old to create an account.
//                         </p>
//                         <div className="bg-amber-50 p-4 rounded-lg mb-4">
//                             <h3 className="font-semibold text-amber-900 mb-2">Account Responsibilities:</h3>
//                             <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                                 <li>You are responsible for maintaining the confidentiality of your account credentials</li>
//                                 <li>You agree to provide accurate, current, and complete information during registration</li>
//                                 <li>You must notify us immediately of any unauthorized use of your account</li>
//                                 <li>We reserve the right to refuse service, terminate accounts, or remove content at our discretion</li>
//                             </ul>
//                         </div>
//                         <p className="text-gray-700">
//                              Priya Fresh Meats reserves the right to remove or reclaim any usernames at its sole discretion. You acknowledge that  Priya Fresh Meats is not liable for any losses caused by any unauthorized use of your account.
//                         </p>
//                     </div>

//                     {/* Ordering Process Section */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Ordering Process</h2>
//                         <p className="text-gray-700 mb-4">
//                             Orders are placed through our website or mobile application. By placing an order, you make an offer to purchase the products selected.
//                         </p>
//                         <div className="bg-amber-50 p-4 rounded-lg mb-4">
//                             <h3 className="font-semibold text-amber-900 mb-2">Order Confirmation:</h3>
//                             <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                                 <li>You will receive an order confirmation email after placing your order</li>
//                                 <li>We reserve the right to refuse or cancel any order for any reason</li>
//                                 <li>Certain orders may require additional verification or information</li>
//                                 <li>Orders are subject to product availability</li>
//                             </ul>
//                         </div>
//                         <p className="text-gray-700">
//                             In the event that a product is mispriced, we may refuse or cancel orders for that product. If a product is unavailable after you have placed an order, we will notify you and refund any amounts charged for that product.
//                         </p>
//                     </div>

//                     {/* Payment & Pricing Section */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Payment & Pricing</h2>
//                         <p className="text-gray-700 mb-4">
//                             All prices are shown in your local currency and include applicable taxes unless otherwise stated. We reserve the right to change prices at any time without notice.
//                         </p>
//                         <div className="bg-amber-50 p-4 rounded-lg mb-4">
//                             <h3 className="font-semibold text-amber-900 mb-2">Payment Methods:</h3>
//                             <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                                 <li>We accept major credit cards, debit cards, and digital payment methods</li>
//                                 <li>Payment is processed at the time of order placement</li>
//                                 <li>All transactions are secure and encrypted</li>
//                                 <li>You agree to provide current and valid payment information</li>
//                             </ul>
//                         </div>
//                         <p className="text-gray-700">
//                             In cases of suspected fraud, we reserve the right to cancel any order. You are responsible for any fees or charges incurred due to insufficient funds or other payment issues.
//                         </p>
//                     </div>

//                     {/* Delivery Policy Section */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Delivery Policy</h2>
//                         <p className="text-gray-700 mb-4">
//                             We deliver to the address specified during checkout. Delivery times are estimates and not guaranteed. Factors such as traffic, weather, and other conditions may affect delivery times.
//                         </p>
//                         <div className="bg-amber-50 p-4 rounded-lg mb-4">
//                             <h3 className="font-semibold text-amber-900 mb-2">Delivery Requirements:</h3>
//                             <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                                 <li>Someone must be available to receive the delivery</li>
//                                 <li>Perishable items cannot be left unattended</li>
//                                 <li>Delivery fees vary based on location and order size</li>
//                                 <li>We may require ID verification for alcohol-containing products</li>
//                             </ul>
//                         </div>
//                         <p className="text-gray-700">
//                             If no one is available to receive the delivery, we will attempt to contact you. After multiple failed delivery attempts, your order may be returned to us, and restocking fees may apply.
//                         </p>
//                     </div>

//                     {/* Product Quality Section */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Product Quality</h2>
//                         <p className="text-gray-700 mb-4">
//                             We take pride in providing high-quality meat products. All products are sourced from reputable suppliers and handled according to strict food safety standards.
//                         </p>
//                         <div className="bg-amber-50 p-4 rounded-lg mb-4">
//                             <h3 className="font-semibold text-amber-900 mb-2">Quality Assurance:</h3>
//                             <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                                 <li>Products are stored and transported at proper temperatures</li>
//                                 <li>We follow all applicable food safety regulations</li>
//                                 <li>Products are packaged to maintain freshness and prevent contamination</li>
//                                 <li>We conduct regular quality checks</li>
//                             </ul>
//                         </div>
//                         <p className="text-gray-700">
//                             While we take every precaution to ensure product quality, we cannot guarantee that products will always meet every customer's expectations due to the natural variations in meat products.
//                         </p>
//                     </div>

//                     {/* Returns & Refunds Section */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Returns & Refunds</h2>
//                         <p className="text-gray-700 mb-4">
//                             Due to the perishable nature of our products, we generally do not accept returns. However, if you receive a damaged, incorrect, or spoiled product, please contact us immediately.
//                         </p>
//                         <div className="bg-amber-50 p-4 rounded-lg mb-4">
//                             <h3 className="font-semibold text-amber-900 mb-2">Refund Eligibility:</h3>
//                             <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                                 <li>Contact us within 24 hours of delivery for quality issues</li>
//                                 <li>Provide photos of the product in question</li>
//                                 <li>We may require return of the product for inspection</li>
//                                 <li>Refunds are processed to the original payment method</li>
//                             </ul>
//                         </div>
//                         <p className="text-gray-700">
//                             We evaluate refund requests on a case-by-case basis. If approved, refunds will be processed within 7-10 business days. Delivery fees are non-refundable unless the error was due to our mistake.
//                         </p>
//                     </div>

//                     {/* Liability Section */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Liability</h2>
//                         <p className="text-gray-700 mb-4">
//                              Priya Fresh Meats's liability is limited to the maximum extent permitted by law. We are not liable for any indirect, incidental, special, consequential, or punitive damages.
//                         </p>
//                         <div className="bg-amber-50 p-4 rounded-lg mb-4">
//                             <h3 className="font-semibold text-amber-900 mb-2">Limitations:</h3>
//                             <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                                 <li>We are not liable for improper storage or handling after delivery</li>
//                                 <li>We are not responsible for allergic reactions or food sensitivities</li>
//                                 <li>Our total liability for any claim shall not exceed the purchase price of the products</li>
//                                 <li>We are not liable for delays beyond our reasonable control</li>
//                             </ul>
//                         </div>
//                         <p className="text-gray-700">
//                             You agree to properly handle, store, and cook all products according to food safety guidelines.  Priya Fresh Meats is not responsible for any illness or injury resulting from improper handling, storage, or preparation of products.
//                         </p>
//                     </div>

//                     {/* User Conduct Section */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">9. User Conduct</h2>
//                         <p className="text-gray-700 mb-4">
//                             You agree to use  Priya Fresh Meats services only for lawful purposes and in accordance with these Terms. You agree not to use our services:
//                         </p>
//                         <div className="bg-amber-50 p-4 rounded-lg mb-4">
//                             <h3 className="font-semibold text-amber-900 mb-2">Prohibited Activities:</h3>
//                             <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                                 <li>In any way that violates any applicable law or regulation</li>
//                                 <li>To engage in any fraudulent or deceptive activities</li>
//                                 <li>To harass, abuse, or harm another person</li>
//                                 <li>To interfere with or disrupt the service or servers</li>
//                                 <li>To attempt to gain unauthorized access to any part of the service</li>
//                             </ul>
//                         </div>
//                         <p className="text-gray-700">
//                             We reserve the right to terminate or suspend your account and access to the service for conduct that we determine, in our sole discretion, violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
//                         </p>
//                     </div>

//                     {/* Changes to Terms Section */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Changes to Terms</h2>
//                         <p className="text-gray-700 mb-4">
//                             We may update these Terms from time to time to reflect changes in our practices, service features, or legal requirements. We will notify you of any material changes by posting the new Terms on this page.
//                         </p>
//                         <div className="bg-amber-50 p-4 rounded-lg mb-4">
//                             <h3 className="font-semibold text-amber-900 mb-2">Notification of Changes:</h3>
//                             <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                                 <li>We will update the "Last updated" date at the top of these Terms</li>
//                                 <li>For significant changes, we may provide additional notice</li>
//                                 <li>Continued use of the service after changes constitutes acceptance</li>
//                                 <li>We encourage you to review these Terms periodically</li>
//                             </ul>
//                         </div>
//                         <p className="text-gray-700">
//                             If you do not agree to the updated Terms, you must stop using the service. Material changes will not be applied retroactively without your consent to the extent required by law.
//                         </p>
//                     </div>

//                     {/* Acceptance Section */}
//                     <div className="mt-8 pt-6 border-t border-gray-200">
//                         <div className="bg-red-50 p-4 rounded-lg">
//                             <h3 className="font-semibold text-red-800 mb-2">Acceptance of Terms</h3>
//                             <p className="text-gray-700">
//                                 By using  Priya Fresh Meats services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these Terms, you may not use our services.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserTermsAndCondition;

import React from 'react';

const UserTermsAndCondition: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-800 to-red-800 p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
                    <p className="text-amber-200">Last updated: 08/09/2025</p>
                </div>

                <div className="p-6 md:p-8">
                    {/* Introduction Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 mb-4">
                            Welcome to <span className="font-semibold text-amber-900">Priya Fresh Meats</span>. These Terms and Conditions govern your use of our meat delivery service and website. By accessing or using our service, you agree to be bound by these Terms.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Priya Fresh Meats provides fresh meat, poultry, eggs, and related products through our online platform and delivery service. These Terms apply to all users of the service, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
                        </p>
                        <p className="text-gray-700">
                            Please read these Terms carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
                        </p>
                    </div>

                    {/* Account Terms Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Account Terms</h2>
                        <p className="text-gray-700 mb-4">
                            To access and use certain features of Priya Fresh Meats, you may be required to register for an account. You must be at least 18 years old to create an account.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Account Responsibilities:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                                <li>You agree to provide accurate, current, and complete information during registration</li>
                                <li>You must notify us immediately of any unauthorized use of your account</li>
                                <li>We reserve the right to refuse service, terminate accounts, or remove content at our discretion</li>
                            </ul>
                        </div>
                        <p className="text-gray-700">
                            Priya Fresh Meats reserves the right to remove or reclaim any usernames at its sole discretion. You acknowledge that Priya Fresh Meats is not liable for any losses caused by any unauthorized use of your account.
                        </p>
                    </div>

                    {/* Ordering Process Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Ordering Process</h2>
                        <p className="text-gray-700 mb-4">
                            Orders are placed through our website or mobile application. By placing an order, you make an offer to purchase the products selected.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Order Confirmation:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>You will receive an order confirmation email after placing your order</li>
                                <li>We reserve the right to refuse or cancel any order for any reason</li>
                                <li>Certain orders may require additional verification or information</li>
                                <li>Orders are subject to product availability</li>
                            </ul>
                        </div>
                        <p className="text-gray-700">
                            In the event that a product is mispriced, we may refuse or cancel orders for that product. If a product is unavailable after you have placed an order, we will notify you and refund any amounts charged for that product.
                        </p>
                    </div>

                    {/* Payment & Pricing Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Payment & Pricing</h2>
                        <p className="text-gray-700 mb-4">
                            All prices are shown in your local currency and include applicable taxes unless otherwise stated. We reserve the right to change prices at any time without notice.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Payment Methods:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>We accept major credit cards, debit cards, and digital payment methods</li>
                                <li>Payment is processed at the time of order placement</li>
                                <li>All transactions are secure and encrypted</li>
                                <li>You agree to provide current and valid payment information</li>
                            </ul>
                        </div>
                        <p className="text-gray-700">
                            In cases of suspected fraud, we reserve the right to cancel any order. You are responsible for any fees or charges incurred due to insufficient funds or other payment issues.
                        </p>
                    </div>

                    {/* Delivery Policy Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Delivery Policy</h2>
                        <p className="text-gray-700 mb-4">
                            We deliver to the address specified during checkout. Delivery times are estimates and not guaranteed. Factors such as traffic, weather, and other conditions may affect delivery times.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Delivery Requirements:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Someone must be available to receive the delivery</li>
                                <li>Perishable items cannot be left unattended</li>
                                <li>Delivery fees vary based on location and order size</li>
                                <li>We may require ID verification for alcohol-containing products</li>
                            </ul>
                        </div>
                        <p className="text-gray-700">
                            If no one is available to receive the delivery, we will attempt to contact you. After multiple failed delivery attempts, your order may be returned to us, and restocking fees may apply.
                        </p>
                    </div>

                    {/* Product Quality Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Product Quality</h2>
                        <p className="text-gray-700 mb-4">
                            We take pride in providing high-quality meat products. All products are sourced from reputable suppliers and handled according to strict food safety standards.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Quality Assurance:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>Products are stored and transported at proper temperatures</li>
                                <li>We follow all applicable food safety regulations</li>
                                <li>Products are packaged to maintain freshness and prevent contamination</li>
                                <li>We conduct regular quality checks</li>
                            </ul>
                        </div>
                        <p className="text-gray-700">
                            While we take every precaution to ensure product quality, we cannot guarantee that products will always meet every customer's expectations due to the natural variations in meat products.
                        </p>
                    </div>

                    {/* Liability Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Liability</h2>
                        <p className="text-gray-700 mb-4">
                            Priya Fresh Meats's liability is limited to the maximum extent permitted by law. We are not liable for any indirect, incidental, special, consequential, or punitive damages.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Limitations:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>We are not liable for improper storage or handling after delivery</li>
                                <li>We are not responsible for allergic reactions or food sensitivities</li>
                                <li>Our total liability for any claim shall not exceed the purchase price of the products</li>
                                <li>We are not liable for delays beyond our reasonable control</li>
                            </ul>
                        </div>
                        <p className="text-gray-700">
                            You agree to properly handle, store, and cook all products according to food safety guidelines. Priya Fresh Meats is not responsible for any illness or injury resulting from improper handling, storage, or preparation of products.
                        </p>
                    </div>

                    {/* User Conduct Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">8. User Conduct</h2>
                        <p className="text-gray-700 mb-4">
                            You agree to use Priya Fresh Meats services only for lawful purposes and in accordance with these Terms. You agree not to use our services:
                        </p>
                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Prohibited Activities:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>In any way that violates any applicable law or regulation</li>
                                <li>To engage in any fraudulent or deceptive activities</li>
                                <li>To harass, abuse, or harm another person</li>
                                <li>To interfere with or disrupt the service or servers</li>
                                <li>To attempt to gain unauthorized access to any part of the service</li>
                            </ul>
                        </div>
                        <p className="text-gray-700">
                            We reserve the right to terminate or suspend your account and access to the service for conduct that we determine, in our sole discretion, violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                        </p>
                    </div>

                    {/* Changes to Terms Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to Terms</h2>
                        <p className="text-gray-700 mb-4">
                            We may update these Terms from time to time to reflect changes in our practices, service features, or legal requirements. We will notify you of any material changes by posting the new Terms on this page.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-amber-900 mb-2">Notification of Changes:</h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>We will update the "Last updated" date at the top of these Terms</li>
                                <li>For significant changes, we may provide additional notice</li>
                                <li>Continued use of the service after changes constitutes acceptance</li>
                                <li>We encourage you to review these Terms periodically</li>
                            </ul>
                        </div>
                        <p className="text-gray-700">
                            If you do not agree to the updated Terms, you must stop using the service. Material changes will not be applied retroactively without your consent to the extent required by law.
                        </p>
                    </div>

                    {/* Acceptance Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-red-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-red-800 mb-2">Acceptance of Terms</h3>
                            <p className="text-gray-700">
                                By using Priya Fresh Meats services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these Terms, you may not use our services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTermsAndCondition;