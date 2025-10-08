import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_CONFIG } from '../../../config/api.config';

interface DeliveryPartner {
    _id: string;
    name: string;
    phone: string;
    status: 'verified' | 'pending';
    documentStatus: {
        idProof: 'verified' | 'pending' | 'rejected';
        addressProof: 'verified' | 'pending' | 'rejected';
        vehicleDocuments: 'verified' | 'pending' | 'rejected';
        drivingLicense: 'verified' | 'pending' | 'rejected';
        insuranceDocuments: 'verified' | 'pending' | 'rejected';
    };
}

const AddPartner: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [newPartner, setNewPartner] = useState({
        name: '',
        phone: '',
        status: 'pending' as 'verified' | 'pending',
        documentStatus: {
            idProof: 'pending' as 'verified' | 'pending' | 'rejected',
            addressProof: 'pending' as 'verified' | 'pending' | 'rejected',
            vehicleDocuments: 'pending' as 'verified' | 'pending' | 'rejected',
            drivingLicense: 'pending' as 'verified' | 'pending' | 'rejected',
            insuranceDocuments: 'pending' as 'verified' | 'pending' | 'rejected'
        }
    });

    // Calculate overall status based on document verification
    const calculateOverallStatus = (documentStatus: any) => {
        const allVerified = Object.values(documentStatus).every(status => status === 'verified');
        return allVerified ? 'verified' : 'pending';
    };

    const handleCreatePartner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPartner.name || !newPartner.phone) {
            setError('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Get auth token
            const managerUser = localStorage.getItem('managerUser');
            const accessToken = localStorage.getItem('accessToken');
            const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);

            if (!token) {
                setError('Authentication required. Please log in.');
                return;
            }

            // Calculate overall status
            const overallStatus = calculateOverallStatus(newPartner.documentStatus);

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newPartner.name,
                    phoneNumber: newPartner.phone,
                    status: overallStatus,
                    documentStatus: newPartner.documentStatus
                })
            });

            if (!response.ok) {
                let message = 'Failed to create partner';
                try {
                    const errorData = await response.json();
                    message = errorData.message || message;
                } catch { }
                if (response.status === 409) {
                    message = 'A partner with this phone number already exists. Please use a different number.';
                }
                throw new Error(message);
            }

            // Read created partner to obtain id and persist UI-only document statuses
            const created = await response.json();
            const createdId = created?.data?._id;
            if (createdId) {
                try {
                    // Persist UI-only for backward compatibility
                    localStorage.setItem(`dpDocumentStatus:${createdId}`, JSON.stringify(newPartner.documentStatus));

                    // Persist per-document statuses in backend via bulk endpoint
                    const documentsPayload = {
                        documents: [
                            { documentType: 'idProof', status: newPartner.documentStatus.idProof },
                            { documentType: 'addressProof', status: newPartner.documentStatus.addressProof },
                            { documentType: 'vehicleDocuments', status: newPartner.documentStatus.vehicleDocuments },
                            { documentType: 'drivingLicense', status: newPartner.documentStatus.drivingLicense },
                            { documentType: 'insuranceDocuments', status: newPartner.documentStatus.insuranceDocuments }
                        ]
                    };
                    await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS}/${createdId}/documents/bulk`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(documentsPayload)
                    });
                } catch { }
            }

            console.log('✅ Partner created successfully');
            navigate('/manager/delivery-partner');
        } catch (err) {
            console.error('❌ Error creating partner:', err);
            setError(err instanceof Error ? err.message : 'Failed to create partner');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setNewPartner(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleDocumentStatusChange = (documentType: string, status: 'verified' | 'pending' | 'rejected') => {
        setNewPartner(prev => ({
            ...prev,
            documentStatus: {
                ...prev.documentStatus,
                [documentType]: status
            }
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                Add New Delivery Partner
                            </h1>
                            <p className="text-gray-600 mt-1">Create a new delivery partner for your operations</p>
                        </div>
                        <button
                            onClick={() => navigate('/manager/delivery-partner')}
                            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Staff
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <form onSubmit={handleCreatePartner} className="space-y-6">
                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Name Field */}
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newPartner.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white group-hover:border-gray-300"
                                    placeholder="e.g., John Doe"
                                    required
                                />
                            </div>

                            {/* Phone Number Field */}
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={newPartner.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 group-hover:bg-white group-hover:border-gray-300"
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </div>

                            {/* Document Verification Fields */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Verification Status</h3>
                                <p className="text-sm text-gray-600 mb-4">Set the verification status for each required document. Overall status will be automatically calculated.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ID Proof
                                        </label>
                                        <select
                                            value={newPartner.documentStatus.idProof}
                                            onChange={(e) => handleDocumentStatusChange('idProof', e.target.value as 'verified' | 'pending' | 'rejected')}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
                                        >
                                            <option value="pending">⏳ Pending</option>
                                            <option value="verified">✅ Verified</option>
                                            <option value="rejected">❌ Rejected</option>
                                        </select>
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Proof
                                        </label>
                                        <select
                                            value={newPartner.documentStatus.addressProof}
                                            onChange={(e) => handleDocumentStatusChange('addressProof', e.target.value as 'verified' | 'pending' | 'rejected')}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
                                        >
                                            <option value="pending">⏳ Pending</option>
                                            <option value="verified">✅ Verified</option>
                                            <option value="rejected">❌ Rejected</option>
                                        </select>
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Vehicle Documents
                                        </label>
                                        <select
                                            value={newPartner.documentStatus.vehicleDocuments}
                                            onChange={(e) => handleDocumentStatusChange('vehicleDocuments', e.target.value as 'verified' | 'pending' | 'rejected')}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
                                        >
                                            <option value="pending">⏳ Pending</option>
                                            <option value="verified">✅ Verified</option>
                                            <option value="rejected">❌ Rejected</option>
                                        </select>
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Driving License
                                        </label>
                                        <select
                                            value={newPartner.documentStatus.drivingLicense}
                                            onChange={(e) => handleDocumentStatusChange('drivingLicense', e.target.value as 'verified' | 'pending' | 'rejected')}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
                                        >
                                            <option value="pending">⏳ Pending</option>
                                            <option value="verified">✅ Verified</option>
                                            <option value="rejected">❌ Rejected</option>
                                        </select>
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Insurance Documents
                                        </label>
                                        <select
                                            value={newPartner.documentStatus.insuranceDocuments}
                                            onChange={(e) => handleDocumentStatusChange('insuranceDocuments', e.target.value as 'verified' | 'pending' | 'rejected')}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white group-hover:bg-gray-100"
                                        >
                                            <option value="pending">⏳ Pending</option>
                                            <option value="verified">✅ Verified</option>
                                            <option value="rejected">❌ Rejected</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-blue-700">
                                            <strong>Note:</strong> Overall status will be "Verified" only when all documents are verified. If any document is pending or rejected, status will be "Pending".
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate('/manager/delivery-partner')}
                                    className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submit...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Submit
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPartner;
