"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Package, Users, Settings } from "lucide-react";

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple client-side auth check
        // Logic: Check if "admin_auth" cookie exists
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(c => c.trim().startsWith('admin_auth='));

        if (!authCookie) {
            router.push("/admin/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        document.cookie = "admin_auth=; path=/; max-age=0"; // Delete cookie
        router.push("/admin/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-maroon/30 border-t-maroon rounded-full animate-spin"></div>
                    <p className="text-stone-500 text-sm font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Admin Sidebar / Layout will go here later */}
            <div className="bg-white border-b border-stone-200">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                    <h1 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
                        <LayoutDashboard className="text-maroon" size={20} />
                        Admin Dashboard
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <Package size={24} />
                            </div>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <p className="text-stone-500 text-sm mb-1">Total Products</p>
                        <h3 className="text-2xl font-bold text-stone-800">124</h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">+5%</span>
                        </div>
                        <p className="text-stone-500 text-sm mb-1">Total Enquiries</p>
                        <h3 className="text-2xl font-bold text-stone-800">48</h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                                <Settings size={24} />
                            </div>
                        </div>
                        <p className="text-stone-500 text-sm mb-1">System Status</p>
                        <h3 className="text-2xl font-bold text-stone-800">Active</h3>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-8 text-center py-20">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LayoutDashboard className="text-stone-400" size={32} />
                    </div>
                    <h2 className="text-lg font-bold text-stone-800 mb-2">Welcome to your Dashboard</h2>
                    <p className="text-stone-500 max-w-md mx-auto">
                        Select an option from the menu create new products, manage categories, or view enquiries.
                    </p>
                </div>
            </div>
        </div>
    );
}
