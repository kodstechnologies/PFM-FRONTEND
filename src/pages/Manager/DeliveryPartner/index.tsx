// import React, { useState, useEffect, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import IconPlus from '../../../components/Icon/IconPlus';
// import IconEye from '../../../components/Icon/IconEye';
// import IconTrash from '../../../components/Icon/IconTrash';
// import IconSquareCheck from '../../../components/Icon/IconSquareCheck';
// import IconTxtFile from '../../../components/Icon/IconTxtFile';
// import IconPencil from '../../../components/Icon/IconPencil';
// import CustomTable from '../../../components/CustomTable';
// import { API_CONFIG } from '../../../config/api.config';

// interface DeliveryPartner {
//     _id: string;
//     name: string;
//     phone: string;
//     status: 'verified' | 'pending';
//     overallDocumentStatus: 'verified' | 'pending' | 'rejected';
//     totalDeliveries: number;
//     createdAt: string;
// }

// const DeliveryPartnerList: React.FC = () => {
//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Helper to build API URLs safely (handles relative/absolute endpoints, avoids double concat)
//     const buildApiUrl = useCallback((endpoint: string, ...pathParts: string[]): string => {
//         let url = endpoint;
//         // If endpoint is absolute (starts with http(s)), use as-is but fix common typos like missing ':'
//         if (url.startsWith('http')) {
//             if (url.startsWith('http//')) {
//                 url = url.replace('http//', 'http://');  // Fix typo for http
//             } else if (url.startsWith('https//')) {
//                 url = url.replace('https//', 'https://');  // Fix the exact typo seen in logs
//             }
//         } else {
//             // Relative: prepend BASE_URL
//             const base = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL : `${API_CONFIG.BASE_URL}/`;
//             url = `${base}${url.startsWith('/') ? url.slice(1) : url}`;
//         }
//         // Append path parts if provided
//         if (pathParts.length > 0) {
//             const separator = url.endsWith('/') ? '' : '/';
//             url += `${separator}${pathParts.join('/')}`;
//         }
//         // Validate URL
//         try {
//             new URL(url);
//             console.log('🔗 Built API URL:', url);  // Debug: Confirm correct URL
//             return url;
//         } catch (e) {
//             console.error('❌ Invalid API URL generated:', url, e);
//             throw new Error(`Invalid API URL: ${url}`);
//         }
//     }, []);

//     // Fetch delivery partners from backend
//     const fetchDeliveryPartners = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             setError(null);

//             // Get auth token (with safer parsing)
//             let token: string | null = localStorage.getItem('accessToken');
//             if (!token) {
//                 try {
//                     const managerUser = localStorage.getItem('managerUser');
//                     if (managerUser) {
//                         const parsed = JSON.parse(managerUser);
//                         token = parsed.accessToken || null;
//                     }
//                 } catch (parseErr) {
//                     console.error('❌ Error parsing managerUser from localStorage:', parseErr);
//                     token = null;
//                 }
//             }

//             if (!token) {
//                 setError('Authentication required. Please log in.');
//                 return;
//             }

//             const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS);
//             const response = await fetch(url, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log("🚀 ~ DeliveryPartnerList ~ response:", response);

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to fetch delivery partners: ${response.status} - ${errorText}`);
//             }

//             const data = await response.json();

//             if (data.success && data.data.deliveryPartners) {
//                 setDeliveryPartners(data.data.deliveryPartners);
//                 // Initialize UI-only document statuses for existing partners if missing
//                 try {
//                     data.data.deliveryPartners.forEach((p: any) => {
//                         const key = `dpDocumentStatus:${p._id}`;
//                         if (!localStorage.getItem(key)) {
//                             const defaultStatus = p.status === 'verified' ? 'verified' : 'pending';
//                             const docStatus = {
//                                 idProof: defaultStatus,
//                                 addressProof: defaultStatus,
//                                 vehicleDocuments: defaultStatus,
//                                 drivingLicense: defaultStatus,
//                                 insuranceDocuments: defaultStatus
//                             };
//                             localStorage.setItem(key, JSON.stringify(docStatus));
//                         }
//                     });
//                 } catch (initErr) {
//                     console.error('❌ Error initializing document statuses:', initErr);
//                 }
//                 console.log('✅ Delivery partners fetched successfully:', data.data.deliveryPartners);
//             } else {
//                 setDeliveryPartners([]);
//                 console.log('⚠️ No delivery partners found in response');
//             }
//         } catch (error) {
//             console.error('❌ Error fetching delivery partners:', error);
//             setError(error instanceof Error ? error.message : 'Failed to fetch delivery partners');
//         } finally {
//             setIsLoading(false);
//         }
//     }, [buildApiUrl]);

//     // Load data on component mount
//     useEffect(() => {
//         fetchDeliveryPartners();
//     }, [fetchDeliveryPartners]);

//     // Filter partners based on search and status
//     const filteredPartners = deliveryPartners.filter(partner => {
//         const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             partner._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             partner.phone.toLowerCase().includes(searchTerm.toLowerCase());

//         const matchesStatus = statusFilter === 'all' || partner.overallDocumentStatus === statusFilter;

//         return matchesSearch && matchesStatus;
//     });

//     // Get initials from name
//     const getInitials = (name: string) => {
//         return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
//     };

//     const getStatusIcon = (status: string) => {
//         if (status === 'verified') {
//             return <IconSquareCheck className="w-4 h-4 text-green-500" />;
//         }
//         return <IconTxtFile className="w-4 h-4 text-yellow-500" />;
//     };

//     const getStatusText = (status: string) => {
//         return status === 'verified' ? 'Verified' : 'Pending Docs';
//     };

//     const getStatusColor = (status: string) => {
//         return status === 'verified' ? 'text-green-600' : 'text-yellow-600';
//     };

//     const getInitialsColor = (initials: string) => {
//         const colors = [
//             'bg-blue-500', 'bg-green-500', 'bg-purple-500',
//             'bg-pink-500', 'bg-indigo-500', 'bg-red-500'
//         ];
//         const index = initials.charCodeAt(0) % colors.length;
//         return colors[index];
//     };

//     const getDocStatusText = (status: string) => {
//         switch (status) {
//             case 'verified': return 'Verified';
//             case 'rejected': return 'Rejected';
//             default: return 'Pending';
//         }
//     };

//     const getDocStatusColor = (status: string) => {
//         switch (status) {
//             case 'verified': return 'text-green-600';
//             case 'rejected': return 'text-red-600';
//             default: return 'text-yellow-600';
//         }
//     };

//     const handleDeletePartner = async (partnerId: string) => {
//         if (window.confirm('Are you sure you want to delete this delivery partner?')) {
//             try {
//                 // Reuse token logic from fetch (for consistency)
//                 let token: string | null = localStorage.getItem('accessToken');
//                 if (!token) {
//                     try {
//                         const managerUser = localStorage.getItem('managerUser');
//                         if (managerUser) {
//                             const parsed = JSON.parse(managerUser);
//                             token = parsed.accessToken || null;
//                         }
//                     } catch (parseErr) {
//                         console.error('❌ Error parsing managerUser for delete:', parseErr);
//                         token = null;
//                     }
//                 }

//                 if (!token) {
//                     setError('Authentication required. Please log in.');
//                     return;
//                 }

//                 const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS, partnerId, 'hard');
//                 const response = await fetch(url, {
//                     method: 'DELETE',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 if (response.ok) {
//                     // Remove from local state
//                     setDeliveryPartners(prev => prev.filter(partner => partner._id !== partnerId));
//                     console.log('✅ Delivery partner deleted successfully');
//                 } else {
//                     const errorData = await response.json().catch(() => ({}));
//                     throw new Error(errorData.message || 'Failed to delete delivery partner');
//                 }
//             } catch (error) {
//                 console.error('❌ Error deleting delivery partner:', error);
//                 setError(error instanceof Error ? error.message : 'Failed to delete delivery partner');
//             }
//         }
//     };

//     const handleViewPartner = (partner: DeliveryPartner) => {
//         navigate(`/manager/delivery-partner/details/${partner._id}`);
//     };

//     const handleEditPartner = (partner: DeliveryPartner) => {
//         navigate(`/manager/delivery-partner/edit/${partner._id}`);
//     };

//     // Refresh data
//     const handleRefresh = () => {
//         fetchDeliveryPartners();
//     };

//     if (isLoading) {
//         return (
//             <div className="p-6 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                     <div className="text-xl text-gray-600">Loading delivery partners...</div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="p-6 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
//                     <button
//                         onClick={handleRefresh}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6">
//             {/* Header */}
//             <div className="mb-6 flex justify-between items-center">
//                 <h1 className="text-2xl font-bold text-gray-800">Delivery Partner</h1>
//                 <div className="flex items-center space-x-3">
//                     <button
//                         onClick={handleRefresh}
//                         className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
//                         title="Refresh Data"
//                     >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                         </svg>
//                         Refresh
//                     </button>
//                     <button
//                         onClick={() => navigate('/manager/delivery-partner/add')}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//                     >
//                         <IconPlus className="w-4 h-4" />
//                         Add New Partner
//                     </button>
//                 </div>
//             </div>

//             {/* Search and Filter Section */}
//             <div className="flex flex-col md:flex-row gap-4 mb-6">
//                 {/* Search Bar */}
//                 <div className="flex-1 relative">
//                     <input
//                         type="text"
//                         placeholder="Search by name, ID, phone..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     />
//                 </div>

//                 {/* Status Filter */}
//                 <div className="relative">
//                     <select
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                         className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
//                     >
//                         <option value="all">All Statuses</option>
//                         <option value="verified">Verified</option>
//                         <option value="pending">Pending Docs</option>
//                     </select>
//                 </div>
//             </div>

//             {/* CustomTable */}
//             <CustomTable
//                 pageHeader="Delivery Partners"
//                 data={filteredPartners}
//                 columns={[
//                     {
//                         accessor: '_id',
//                         title: 'STAFF ID',
//                         sortable: true,
//                         render: (partner) => (
//                             <span className="font-mono text-sm text-gray-600">#{partner._id.slice(-8)}</span>
//                         )
//                     },
//                     {
//                         accessor: 'name',
//                         title: 'NAME',
//                         sortable: true,
//                         render: (partner) => (
//                             <div className="flex items-center">
//                                 <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getInitialsColor(getInitials(partner.name))}`}>
//                                     {getInitials(partner.name)}
//                                 </div>
//                                 <div className="ml-3">
//                                     <div className="text-sm font-medium text-gray-900">
//                                         {partner.name}
//                                     </div>
//                                 </div>
//                             </div>
//                         )
//                     },
//                     {
//                         accessor: 'phone',
//                         title: 'PHONE NUMBER',
//                         sortable: true
//                     },
//                     {
//                         accessor: 'totalDeliveries',
//                         title: 'TOTAL DELIVERIES',
//                         sortable: true,
//                         render: (partner) => (
//                             <span className="text-sm font-medium text-gray-900">{partner.totalDeliveries}</span>
//                         )
//                     },
//                     {
//                         accessor: 'overallDocumentStatus',
//                         title: 'DOCUMENT STATUS',
//                         sortable: true,
//                         render: (partner) => (
//                             <div className="flex items-center">
//                                 <span className={`text-sm font-medium ${getDocStatusColor(partner.overallDocumentStatus)}`}>
//                                     {getDocStatusText(partner.overallDocumentStatus)}
//                                 </span>
//                             </div>
//                         )
//                     },
//                     {
//                         accessor: 'actions',
//                         title: 'ACTIONS',
//                         sortable: false,
//                         render: (partner) => (
//                             <div className="flex items-center space-x-2">
//                                 <button
//                                     onClick={() => handleViewPartner(partner)}
//                                     className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
//                                     title="View Details"
//                                 >
//                                     <IconEye className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                     onClick={() => handleEditPartner(partner)}
//                                     className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
//                                     title="Edit Partner"
//                                 >
//                                     <IconPencil className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                     onClick={() => handleDeletePartner(partner._id)}
//                                     className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
//                                     title="Delete Partner"
//                                 >
//                                     <IconTrash className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         )
//                     }
//                 ]}
//                 pageSizeOptions={[5, 10, 20]}
//             />
//         </div>
//     );
// };

// export default DeliveryPartnerList;

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEye from '../../../components/Icon/IconEye';
import IconTrash from '../../../components/Icon/IconTrash';
import IconSquareCheck from '../../../components/Icon/IconSquareCheck';
import IconTxtFile from '../../../components/Icon/IconTxtFile';
import IconPencil from '../../../components/Icon/IconPencil';
import CustomTable from '../../../components/CustomTable';
import { API_CONFIG } from '../../../config/api.config';

interface DeliveryPartner {
    _id: string;
    name: string;
    phone: string;
    status: 'verified' | 'pending';
    overallDocumentStatus: 'verified' | 'pending' | 'rejected';
    totalDeliveries: number;
    createdAt: string;
}

const DeliveryPartnerList: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper to build API URLs safely (handles relative/absolute endpoints, avoids double concat)
    const buildApiUrl = useCallback((endpoint: string, ...pathParts: string[]): string => {
        let url = endpoint;
        // If endpoint is absolute (starts with http(s)), use as-is but fix common typos like missing ':'
        if (url.startsWith('http')) {
            if (url.startsWith('http//')) {
                url = url.replace('http//', 'http://');  // Fix typo for http
            } else if (url.startsWith('https//')) {
                url = url.replace('https//', 'https://');  // Fix the exact typo seen in logs
            }
        } else {
            // Relative: prepend BASE_URL, ensure no double slash
            const base = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL.slice(0, -1) : API_CONFIG.BASE_URL;
            url = `${base}/${url.startsWith('/') ? url.slice(1) : url}`;
        }
        // Append path parts if provided, ensuring no double slash
        if (pathParts.length > 0) {
            const separator = url.endsWith('/') ? '' : '/';
            url += `${separator}${pathParts.join('/')}`;
        }
        // Validate URL
        try {
            new URL(url);
            console.log('🔗 Built API URL:', url);  // Debug: Confirm correct URL
            return url;
        } catch (e) {
            console.error('❌ Invalid API URL generated:', url, e);
            throw new Error(`Invalid API URL: ${url}`);
        }
    }, []);

    // Fetch delivery partners from backend
    const fetchDeliveryPartners = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Get auth token (with safer parsing)
            let token: string | null = localStorage.getItem('accessToken');
            if (!token) {
                try {
                    const managerUser = localStorage.getItem('managerUser');
                    if (managerUser) {
                        const parsed = JSON.parse(managerUser);
                        token = parsed.accessToken || null;
                    }
                } catch (parseErr) {
                    console.error('❌ Error parsing managerUser from localStorage:', parseErr);
                    token = null;
                }
            }

            if (!token) {
                setError('Authentication required. Please log in.');
                return;
            }

            const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS);
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("🚀 ~ DeliveryPartnerList ~ response:", response);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch delivery partners: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (data.success && data.data.deliveryPartners) {
                setDeliveryPartners(data.data.deliveryPartners);
                // Initialize UI-only document statuses for existing partners if missing
                try {
                    data.data.deliveryPartners.forEach((p: any) => {
                        const key = `dpDocumentStatus:${p._id}`;
                        if (!localStorage.getItem(key)) {
                            const defaultStatus = p.status === 'verified' ? 'verified' : 'pending';
                            const docStatus = {
                                idProof: defaultStatus,
                                addressProof: defaultStatus,
                                vehicleDocuments: defaultStatus,
                                drivingLicense: defaultStatus,
                                insuranceDocuments: defaultStatus
                            };
                            localStorage.setItem(key, JSON.stringify(docStatus));
                        }
                    });
                } catch (initErr) {
                    console.error('❌ Error initializing document statuses:', initErr);
                }
                console.log('✅ Delivery partners fetched successfully:', data.data.deliveryPartners);
            } else {
                setDeliveryPartners([]);
                console.log('⚠️ No delivery partners found in response');
            }
        } catch (error) {
            console.error('❌ Error fetching delivery partners:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch delivery partners');
        } finally {
            setIsLoading(false);
        }
    }, [buildApiUrl]);

    // Load data on component mount
    useEffect(() => {
        fetchDeliveryPartners();
    }, [fetchDeliveryPartners]);

    // Filter partners based on search and status
    const filteredPartners = deliveryPartners.filter(partner => {
        const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.phone.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || partner.overallDocumentStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Get initials from name
    const getInitials = (name: string) => {
        return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
    };

    const getStatusIcon = (status: string) => {
        if (status === 'verified') {
            return <IconSquareCheck className="w-4 h-4 text-green-500" />;
        }
        return <IconTxtFile className="w-4 h-4 text-yellow-500" />;
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

    const getDocStatusText = (status: string) => {
        switch (status) {
            case 'verified': return 'Verified';
            case 'rejected': return 'Rejected';
            default: return 'Pending';
        }
    };

    const getDocStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'text-green-600';
            case 'rejected': return 'text-red-600';
            default: return 'text-yellow-600';
        }
    };

    const handleDeletePartner = async (partnerId: string) => {
        if (window.confirm('Are you sure you want to delete this delivery partner?')) {
            try {
                // Reuse token logic from fetch (for consistency)
                let token: string | null = localStorage.getItem('accessToken');
                if (!token) {
                    try {
                        const managerUser = localStorage.getItem('managerUser');
                        if (managerUser) {
                            const parsed = JSON.parse(managerUser);
                            token = parsed.accessToken || null;
                        }
                    } catch (parseErr) {
                        console.error('❌ Error parsing managerUser for delete:', parseErr);
                        token = null;
                    }
                }

                if (!token) {
                    setError('Authentication required. Please log in.');
                    return;
                }

                const url = buildApiUrl(API_CONFIG.ENDPOINTS.MANAGER.DELIVERY_PARTNERS, partnerId, 'hard');
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Remove from local state
                    setDeliveryPartners(prev => prev.filter(partner => partner._id !== partnerId));
                    console.log('✅ Delivery partner deleted successfully');
                } else {
                    const errorText = await response.text();
                    const errorData = JSON.parse(errorText || '{}').catch(() => ({}));
                    throw new Error(errorData.message || `Failed to delete delivery partner: ${response.status}`);
                }
            } catch (error) {
                console.error('❌ Error deleting delivery partner:', error);
                setError(error instanceof Error ? error.message : 'Failed to delete delivery partner');
            }
        }
    };

    const handleViewPartner = (partner: DeliveryPartner) => {
        navigate(`/manager/delivery-partner/details/${partner._id}`);
    };

    const handleEditPartner = (partner: DeliveryPartner) => {
        navigate(`/manager/delivery-partner/edit/${partner._id}`);
    };

    // Refresh data
    const handleRefresh = () => {
        fetchDeliveryPartners();
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <div className="text-xl text-gray-600">Loading delivery partners...</div>
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
                        onClick={handleRefresh}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Delivery Partner</h1>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleRefresh}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        title="Refresh Data"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                    <button
                        onClick={() => navigate('/manager/delivery-partner/add')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <IconPlus className="w-4 h-4" />
                        Add New Partner
                    </button>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Bar */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search by name, ID, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                    >
                        <option value="all">All Statuses</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending Docs</option>
                    </select>
                </div>
            </div>

            {/* CustomTable */}
            <CustomTable
                pageHeader="Delivery Partners"
                data={filteredPartners}
                columns={[
                    {
                        accessor: '_id',
                        title: 'STAFF ID',
                        sortable: true,
                        render: (partner) => (
                            <span className="font-mono text-sm text-gray-600">#{partner._id.slice(-8)}</span>
                        )
                    },
                    {
                        accessor: 'name',
                        title: 'NAME',
                        sortable: true,
                        render: (partner) => (
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getInitialsColor(getInitials(partner.name))}`}>
                                    {getInitials(partner.name)}
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">
                                        {partner.name}
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        accessor: 'phone',
                        title: 'PHONE NUMBER',
                        sortable: true
                    },
                    {
                        accessor: 'totalDeliveries',
                        title: 'TOTAL DELIVERIES',
                        sortable: true,
                        render: (partner) => (
                            <span className="text-sm font-medium text-gray-900">{partner.totalDeliveries}</span>
                        )
                    },
                    {
                        accessor: 'overallDocumentStatus',
                        title: 'DOCUMENT STATUS',
                        sortable: true,
                        render: (partner) => (
                            <div className="flex items-center">
                                <span className={`text-sm font-medium ${getDocStatusColor(partner.overallDocumentStatus)}`}>
                                    {getDocStatusText(partner.overallDocumentStatus)}
                                </span>
                            </div>
                        )
                    },
                    {
                        accessor: 'actions',
                        title: 'ACTIONS',
                        sortable: false,
                        render: (partner) => (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleViewPartner(partner)}
                                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                    title="View Details"
                                >
                                    <IconEye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleEditPartner(partner)}
                                    className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
                                    title="Edit Partner"
                                >
                                    <IconPencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeletePartner(partner._id)}
                                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Partner"
                                >
                                    <IconTrash className="w-4 h-4" />
                                </button>
                            </div>
                        )
                    }
                ]}
                pageSizeOptions={[5, 10, 20]}
            />
        </div>
    );
};

export default DeliveryPartnerList;