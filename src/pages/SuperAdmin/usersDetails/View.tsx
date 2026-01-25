import React, { useEffect, useState } from "react";
import { callApi } from "../../../util/admin_api"; // adjust path if needed

interface User {
    _id: string;
    name: string;
    phone: string;
}

interface Pagination {
    totalUsers: number;
    currentPage: number;
    totalPages: number;
    limit: number;
}

function UserDetails() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await callApi({
                endpoint: `/admin/users?page=${page}&limit=${limit}`,
            });

            setUsers(res.data.users || []);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 inline-block relative">
                        User List
                        <span className="absolute -bottom-1.5 left-0 h-1 w-24 bg-gradient-to-r from-[#EC4143] via-[#ff5858] to-[#EC4143] rounded-full opacity-90"></span>
                    </h1>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Name</span>
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Phone No.</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-24 text-center text-gray-500">
                                            <div className="inline-flex flex-col items-center">
                                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-[#EC4143] border-gray-200 mb-4"></div>
                                                <p className="text-lg font-medium">Loading users...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-24 text-center text-gray-500">
                                            <p className="text-xl font-medium text-gray-700">No users found</p>
                                            <p className="mt-2 text-sm">There are no registered users or the data could not be loaded.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr
                                            key={user._id}
                                            className={`
                        transition-colors duration-150
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                        hover:bg-red-50/30
                      `}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {user.name || "—"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono tracking-wide">
                                                {user.phone || "Not available"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination - Only Prev / Next */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        {/* Info */}
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-medium">{users.length}</span> of{" "}
                            <span className="font-medium">{pagination.totalUsers}</span> users
                            {" • "} Page <span className="font-medium">{page}</span> of{" "}
                            <span className="font-medium">{pagination.totalPages}</span>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`
                  px-6 py-2.5 min-w-[110px] text-sm font-medium rounded-lg
                  bg-gray-100 text-gray-700 border border-gray-300
                  hover:bg-gray-200 hover:border-gray-400
                  active:bg-gray-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-150 shadow-sm
                `}
                            >
                                ← Previous
                            </button>

                            <button
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className={`
                  px-6 py-2.5 min-w-[110px] text-sm font-medium rounded-lg
                  bg-gradient-to-r from-[#EC4143] to-[#ff5858] text-white
                  hover:brightness-110 active:brightness-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-150 shadow-md
                `}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDetails;