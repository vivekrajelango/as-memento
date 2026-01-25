"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShoppingBag, CheckCircle2, XCircle, Smartphone, MapPin, User, Wallet, Loader2, MessageCircle, Package, LayoutDashboard, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Order {
    id: number;
    order_id: string;
    customer_name: string;
    customer_mobile: string;
    delivery_address: string;
    items: any[];
    total_amount: number;
    status: 'pending' | 'approved' | 'declined';
    created_at: string;
}

import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrders() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [actionLoading, setActionLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [commissionPercent, setCommissionPercent] = useState<number>(4);
    const [showSuccess, setShowSuccess] = useState<{ show: boolean, msg: string }>({ show: false, msg: "" });

    useEffect(() => {
        const checkAuth = async () => {
            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(c => c.trim().startsWith('admin_auth='));
            if (!authCookie) {
                router.push("/admin/login");
            } else {
                const username = decodeURIComponent(authCookie.split('=')[1].trim());
                setLoading(true);
                await Promise.all([
                    fetchOrders(),
                    fetchAdminData(username === "true" ? "admin" : username)
                ]);
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    const fetchAdminData = async (username: string) => {
        let { data, error } = await supabase
            .from('admin_users')
            .select('wallet_balance, commission_percent')
            .eq('username', username)
            .single();

        if (error || !data) {
            const { data: fallbackData } = await supabase.from('admin_users').select('wallet_balance, commission_percent').limit(1).single();
            data = fallbackData;
        }

        if (data) {
            setWalletBalance(parseFloat(data.wallet_balance));
            setCommissionPercent(parseFloat(data.commission_percent || "4"));
        }
    };

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from("asm-orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) {
            setOrders(data || []);
        }
    };

    const handleUpdateOrderStatus = async (order: Order, newStatus: 'approved' | 'declined') => {
        setActionLoading(true);
        try {
            if (newStatus === 'approved') {
                const deduction = Math.round(order.total_amount * (commissionPercent / 100));

                const cookies = document.cookie.split(';');
                const authCookie = cookies.find(c => c.trim().startsWith('admin_auth='));
                const usernameRaw = authCookie ? decodeURIComponent(authCookie.split('=')[1].trim()) : "admin";
                const username = usernameRaw === "true" ? "admin" : usernameRaw;

                const { data: adminData } = await supabase
                    .from('admin_users')
                    .select('wallet_balance')
                    .eq('username', username)
                    .single();

                if (adminData && parseFloat(adminData.wallet_balance) < deduction) {
                    alert(`Insufficient points! You need ${deduction} points to approve this order.`);
                    setActionLoading(false);
                    return;
                }

                const { error: walletError } = await supabase
                    .from('admin_users')
                    .update({ wallet_balance: parseFloat(adminData?.wallet_balance || "0") - deduction })
                    .eq('username', username);

                if (walletError) throw walletError;

                // Record transaction
                await supabase.from('wallet_transactions').insert([{
                    username,
                    order_id: order.order_id,
                    amount: -deduction,
                    type: 'deduction',
                    description: `Approval commission for Order #${order.order_id}`
                }]);

                fetchAdminData(username);
                // Dispatch event to refresh wallet in Header
                window.dispatchEvent(new Event('wallet-update'));
            }

            const { error: orderError } = await supabase
                .from('asm-orders')
                .update({ status: newStatus })
                .eq('id', order.id);

            if (orderError) throw orderError;

            fetchOrders();
            setShowSuccess({ show: true, msg: `Order ${newStatus} successfully!` });
            setTimeout(() => setShowSuccess({ show: false, msg: "" }), 3000);
        } catch (err: any) {
            alert("Error updating order: " + err.message);
        }
        setActionLoading(false);
    };

    const handleLogout = () => {
        document.cookie = "admin_auth=; path=/; max-age=0";
        router.push("/admin/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="w-8 h-8 text-maroon animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
                            <ShoppingBag className="text-maroon" size={20} />
                            Order Fulfillment
                        </h1>
                        <nav className="hidden md:flex items-center gap-4 border-l border-stone-200 pl-6">
                            <Link href="/admin/products" className="text-stone-500 hover:text-maroon font-medium text-sm transition-colors">Products</Link>
                            <Link href="/admin/orders" className="text-maroon font-bold text-sm">Orders</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/wallet" className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100/50 transition-colors">
                            <Wallet size={16} className="text-amber-600" />
                            <span className="text-sm font-bold text-amber-900">{walletBalance.toLocaleString()} pts</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                    <div className="p-6">
                        <h2 className="font-serif font-bold text-lg text-stone-800">Incoming Orders</h2>
                    </div>

                    {orders.length === 0 ? (
                        <div className="p-12 text-center text-stone-500">
                            No orders found yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-stone-100">
                            {orders.map((order) => (
                                <div key={order.id} className="p-4 md:p-6 hover:bg-stone-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-stone-900">#{order.order_id}</span>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                                                        order.status === 'pending' ? "bg-amber-100 text-amber-600" :
                                                            order.status === 'approved' ? "bg-emerald-100 text-emerald-600" :
                                                                "bg-rose-100 text-rose-600"
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-stone-400 font-medium">Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-maroon text-lg">₹{order.total_amount}</p>
                                                <p className="text-[10px] text-stone-400 font-bold uppercase">{commissionPercent}% Commission: ₹{Math.round(order.total_amount * (commissionPercent / 100))}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Customer Details</p>
                                                {order.status === 'approved' ? (
                                                    <div className="flex flex-col gap-1 anim-fade-in">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-stone-700">
                                                            <User size={14} className="text-stone-400" />
                                                            {order.customer_name}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-stone-500">
                                                            <Smartphone size={14} className="text-stone-400" />
                                                            {order.customer_mobile}
                                                        </div>
                                                        <div className="flex items-start gap-2 text-xs text-stone-500">
                                                            <MapPin size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />
                                                            <span className="line-clamp-2">{order.delivery_address}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-stone-50 border border-stone-200 border-dashed rounded-xl p-3">
                                                        <div className="flex items-center gap-2 text-stone-400 italic text-xs">
                                                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                                                                <XCircle size={14} />
                                                            </div>
                                                            Details locked until approval
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Items ordered</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <span key={idx} className="text-[11px] text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                                                            {item.quantity}x {item.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col gap-2 md:w-32 flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
                                        {order.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateOrderStatus(order, 'approved')}
                                                    disabled={actionLoading}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10"
                                                >
                                                    <CheckCircle2 size={14} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateOrderStatus(order, 'declined')}
                                                    disabled={actionLoading}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-rose-600 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all"
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </>
                                        ) : order.status === 'approved' ? (
                                            <button
                                                onClick={() => window.open(`https://wa.me/${order.customer_mobile.replace(/\D/g, '')}?text=Hi%20${order.customer_name},%20we've%20approved%20your%20order%20%23${order.order_id}`, "_blank")}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-600/10"
                                            >
                                                <MessageCircle size={14} /> WhatsApp
                                            </button>
                                        ) : (
                                            <div className="w-full text-center py-2 bg-stone-100 rounded-lg text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                                                Rejected
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess.show && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
                    >
                        <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm">Action Complete</p>
                                <p className="text-xs text-stone-400 truncate">{showSuccess.msg}</p>
                            </div>
                            <button
                                onClick={() => setShowSuccess({ show: false, msg: "" })}
                                className="p-2 text-stone-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
