"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Wallet, ArrowLeft, Loader2, ArrowUpRight, ArrowDownLeft, Calendar, Hash, ShoppingBag, Package } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Transaction {
    id: number;
    username: string;
    order_id: string;
    amount: number;
    type: 'deduction' | 'refill';
    description: string;
    created_at: string;
}

export default function AdminWallet() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [walletBalance, setWalletBalance] = useState<number>(0);

    useEffect(() => {
        const checkAuth = async () => {
            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(c => c.trim().startsWith('admin_auth='));
            if (!authCookie) {
                router.push("/admin/login");
            } else {
                const username = decodeURIComponent(authCookie.split('=')[1].trim());
                const finalUsername = username === "true" ? "admin" : username;
                setLoading(true);
                await Promise.all([
                    fetchTransactions(finalUsername),
                    fetchWalletBalance(finalUsername)
                ]);
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    const fetchWalletBalance = async (username: string) => {
        let { data, error } = await supabase
            .from('admin_users')
            .select('wallet_balance')
            .eq('username', username)
            .single();

        if (error || !data) {
            const { data: fallbackData } = await supabase.from('admin_users').select('wallet_balance').limit(1).single();
            data = fallbackData;
        }

        if (data) setWalletBalance(parseFloat(data.wallet_balance));
    };

    const fetchTransactions = async (username: string) => {
        const { data, error } = await supabase
            .from("wallet_transactions")
            .select("*")
            .eq("username", username)
            .order("created_at", { ascending: false });

        if (!error) {
            setTransactions(data || []);
        }
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
                        <Link href="/admin/products" className="p-2 text-stone-400 hover:text-maroon transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
                            <Wallet className="text-maroon" size={20} />
                            Wallet History
                        </h1>
                        <nav className="hidden md:flex items-center gap-4 border-l border-stone-200 pl-6">
                            <Link href="/admin/products" className="text-stone-500 hover:text-maroon font-medium text-sm transition-colors">Products</Link>
                            <Link href="/admin/orders" className="text-stone-500 hover:text-maroon font-medium text-sm transition-colors">Orders</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Balance Card */}
                <div className="bg-maroon rounded-2xl p-8 mb-8 text-white shadow-xl shadow-maroon/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Current Points Balance</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold">{walletBalance.toLocaleString()} <span className="text-xl md:text-2xl opacity-60">pts</span></h2>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                    <Wallet className="absolute right-8 bottom-8 text-white/10 w-32 h-32 rotate-12" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                    <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
                        <h3 className="font-serif font-bold text-lg text-stone-800">Recent Activity</h3>
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-stone-100">
                            {transactions.length} Transactions
                        </span>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wallet className="text-stone-300" size={32} />
                            </div>
                            <p className="text-stone-500 font-medium">No transactions recorded yet.</p>
                            <p className="text-stone-400 text-sm">Your approval commissions will appear here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-stone-100">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="p-4 md:p-6 hover:bg-stone-50/50 transition-colors flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                        tx.type === 'deduction' ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                                    )}>
                                        {tx.type === 'deduction' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-bold text-stone-800 text-sm md:text-base truncate">
                                                {tx.description}
                                            </p>
                                            <p className={cn(
                                                "font-bold text-base md:text-lg whitespace-nowrap",
                                                tx.type === 'deduction' ? "text-rose-600" : "text-emerald-600"
                                            )}>
                                                {tx.type === 'deduction' ? "-" : "+"}{Math.abs(tx.amount).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                                            <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium">
                                                <Calendar size={14} />
                                                {new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {tx.order_id && (
                                                <div className="flex items-center gap-1.5 text-xs text-stone-400 font-bold uppercase tracking-tight">
                                                    <Hash size={14} />
                                                    Order: {tx.order_id}
                                                </div>
                                            )}
                                            <div className={cn(
                                                "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                                                tx.type === 'deduction' ? "bg-rose-50/50 border-rose-100 text-rose-500" : "bg-emerald-50/50 border-emerald-100 text-emerald-500"
                                            )}>
                                                {tx.type}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
