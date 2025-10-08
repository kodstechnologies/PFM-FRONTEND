import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IconArrowBackward from '../../../components/Icon/IconArrowBackward';
import IconSquareCheck from '../../../components/Icon/IconSquareCheck';
import IconTxtFile from '../../../components/Icon/IconTxtFile';
import { API_CONFIG } from '../../../config/api.config';

interface DeliveryPartner {
    _id: string;
    name: string;
    phone: string;
    status: 'verified' | 'pending';
    overallDocumentStatus: 'verified' | 'pending' | 'rejected';
    totalDeliveries: number;
    totalAccepted: number;
    totalRejected: number;
    createdAt: string;
    assignedOrders: Array<{
        _id: string;
        orderId: string;
        status: string;
        totalAmount: number;
        customerAddress: string;
        deliveryAddress: string;
        createdAt: string;
    }>;
    documentStatus: {
        idProof: 'verified' | 'pending' | 'rejected';
        addressProof: 'verified' | 'pending' | 'rejected';
        vehicleDocuments: 'verified' | 'pending' | 'rejected';
        drivingLicense: 'verified' | 'pending' | 'rejected';
        insuranceDocuments: 'verified' | 'pending' | 'rejected';
    };
}

const PartnerDetails: React.FC = () => {
    const navigate = useNavigate();
    const { partnerId } = useParams<{ partnerId: string }>();
    const [partner, setPartner] = useState<DeliveryPartner | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch partner details from backend
    const fetchPartnerDetails = useCallback(async () => {
        if (!partnerId) return;
        
        try {
            setLoading(true);
            setError(null);

            // Get auth token
            const managerUser = localStorage.getItem('managerUser');
            const accessToken = localStorage.getItem('accessToken');
            const token = accessToken || (managerUser ? JSON.parse(managerUser).accessToken : null);

            if (!token) {
                setError('Authentication required. Please log in.');
                return;
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS}/${partnerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch partner details: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.data) {
                setPartner(data.data);
                console.log('✅ Partner details fetched successfully:', data.data);
            } else {
                throw new Error('No partner data found in response');
            }
        } catch (error) {
            console.error('❌ Error fetching partner details:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch partner details');
        } finally {
            setLoading(false);
        }
    }, [partnerId]);

    useEffect(() => {
        fetchPartnerDetails();
    }, [fetchPartnerDetails]);

    // Get initials from name
    const getInitials = (name: string) => {
        return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
    };

    const getStatusIcon = (status: string) => {
        if (status === 'verified') {
            return <IconSquareCheck className="w-6 h-6 text-green-500" />;
        }
        return <IconTxtFile className="w-6 h-6 text-yellow-500" />;
    };

    const getStatusText = (status: string) => {
        return status === 'verified' ? 'Verified' : 'Pending Docs';
    };

    const getStatusColor = (status: string) => {
        return status === 'verified' ? 'text-green-600' : 'text-yellow-600';
    };

    const getInitialsColor = (initials: string) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
            'bg-pink-500', 'bg-indigo-500', 'bg-red-500'
        ];
        const index = initials.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getDocumentStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'text-green-600';
            case 'rejected': return 'text-red-600';
            default: return 'text-yellow-600';
        }
    };

    const getDocumentStatusText = (status: string) => {
        switch (status) {
            case 'verified': return 'Verified';
            case 'rejected': return 'Rejected';
            default: return 'Pending';
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <div className="text-xl text-gray-600">Loading partner details...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                    <button 
                        onClick={() => navigate('/manager/delivery-partner')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    if (!partner) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-500 text-xl mb-4">Partner not found</div>
                    <button 
                        onClick={() => navigate('/manager/delivery-partner')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate('/manager/delivery-partner')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    title="Back to List"
                >
                    <IconArrowBackward className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Partner Details</h1>
            </div>

            {/* Partner Details Card */}
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Partner Header */}
                    <div className="flex items-center mb-8">
                        <div className={`flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${getInitialsColor(partner.name)}`}>
                            {getInitials(partner.name)}
                        </div>
                        <div className="ml-6">
                            <h2 className="text-2xl font-bold text-gray-900">{partner.name}</h2>
                            <p className="text-gray-600">Staff ID: {partner._id}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Contact Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <p className="text-lg text-gray-900">{partner.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Staff ID</label>
                                    <p className="text-lg text-gray-900 font-mono">#{partner._id.slice(-8)}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Status Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Verification Status</label>
                                    <div className="flex items-center mt-1">
                                        {getStatusIcon(partner.status)}
                                        <span className={`ml-2 text-lg font-medium ${getStatusColor(partner.status)}`}>
                                            {getStatusText(partner.status)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Overall Document Status</label>
                                    <span className={`text-lg font-medium ${getDocumentStatusColor(partner.overallDocumentStatus)}`}>
                                        {getDocumentStatusText(partner.overallDocumentStatus)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Statistics */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                            Delivery Statistics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <label className="text-sm font-medium text-gray-700">Total Deliveries</label>
                                <p className="text-2xl font-bold text-blue-600">{partner.totalDeliveries}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <label className="text-sm font-medium text-gray-700">Accepted Orders</label>
                                <p className="text-2xl font-bold text-green-600">{partner.totalAccepted}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <label className="text-sm font-medium text-gray-700">Rejected Orders</label>
                                <p className="text-2xl font-bold text-red-600">{partner.totalRejected}</p>
                            </div>
                        </div>
                    </div>

                    {/* Document Status */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                            Document Verification Status
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">ID Proof</label>
                                <span className={`ml-2 text-sm font-medium ${getDocumentStatusColor(partner.documentStatus.idProof)}`}>
                                    {getDocumentStatusText(partner.documentStatus.idProof)}
                                </span>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Address Proof</label>
                                <span className={`ml-2 text-sm font-medium ${getDocumentStatusColor(partner.documentStatus.addressProof)}`}>
                                    {getDocumentStatusText(partner.documentStatus.addressProof)}
                                </span>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Vehicle Documents</label>
                                <span className={`ml-2 text-sm font-medium ${getDocumentStatusColor(partner.documentStatus.vehicleDocuments)}`}>
                                    {getDocumentStatusText(partner.documentStatus.vehicleDocuments)}
                                </span>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Driving License</label>
                                <span className={`ml-2 text-sm font-medium ${getDocumentStatusColor(partner.documentStatus.drivingLicense)}`}>
                                    {getDocumentStatusText(partner.documentStatus.drivingLicense)}
                                </span>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Insurance Documents</label>
                                <span className={`ml-2 text-sm font-medium ${getDocumentStatusColor(partner.documentStatus.insuranceDocuments)}`}>
                                    {getDocumentStatusText(partner.documentStatus.insuranceDocuments)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Orders */}
                    {partner.assignedOrders && partner.assignedOrders.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                                Recent Assigned Orders ({partner.assignedOrders.length})
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {partner.assignedOrders.slice(0, 5).map((order) => (
                                    <div key={order._id} className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                                                <p className="text-sm text-gray-600">Status: {order.status}</p>
                                                <p className="text-sm text-gray-600">Amount: ₹{order.totalAmount}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                            Additional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Member Since</label>
                                <p className="text-gray-900">{new Date(partner.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Initials</label>
                                <p className="text-gray-900">{getInitials(partner.name)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            onClick={() => navigate('/manager/delivery-partner')}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Back to List
                        </button>
                        <button
                            onClick={() => navigate(`/manager/delivery-partner/edit/${partner._id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Edit Partner
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerDetails;
