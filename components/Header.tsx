"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, User, Menu, Heart, X, ChevronRight, Wallet, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [adminUser, setAdminUser] = useState<string | null>(null);
    const [walletPoints, setWalletPoints] = useState<number | null>(null);
    const { count } = useCart();

    useEffect(() => {
        const checkAdmin = async () => {
            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(c => c.trim().startsWith('admin_auth='));
            if (authCookie) {
                const value = decodeURIComponent(authCookie.split('=')[1].trim());
                // If the cookie is just "true", we don't have the username. 
                // We'll set it to "admin" as a fallback or ask user to relogin
                const username = value === "true" ? "admin" : value;
                setAdminUser(username);

                // Fetch wallet balance
                let { data, error } = await supabase
                    .from('admin_users')
                    .select('wallet_balance')
                    .eq('username', username)
                    .single();

                // Fallback for single admin setups or if username mismatch
                if (error || !data) {
                    const { data: fallbackData } = await supabase
                        .from('admin_users')
                        .select('wallet_balance')
                        .limit(1)
                        .single();
                    data = fallbackData;
                }

                if (data) {
                    setWalletPoints(parseFloat(data.wallet_balance));
                }
            } else {
                // Clear state if no admin cookie is found
                setAdminUser(null);
                setWalletPoints(null);
            }
        };
        checkAdmin();

        // Optional: listen for changes or refresh periodically
        const interval = setInterval(checkAdmin, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/100 backdrop-blur-md border-b border-sandalwood/20 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Mobile Menu Icon (Hidden on Desktop) */}
                    <button
                        className="md:hidden p-2 text-maroon"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="relative h-16 w-64 md:w-48 flex-shrink-0">
                        <Image
                            src="/images/logo2.png"
                            alt="Momento"
                            fill
                            className="object-contain object-left p-1"
                            priority
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-stone-700 hover:text-maroon transition-colors font-medium">Home</Link>
                        <Link href="/products" className="text-stone-700 hover:text-maroon transition-colors font-medium">Collections</Link>
                        <Link href="/about" className="text-stone-700 hover:text-maroon transition-colors font-medium">Our Story</Link>
                        <Link href="/contact" className="text-stone-700 hover:text-maroon transition-colors font-medium">Contact</Link>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        {adminUser ? (
                            <>

                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-50 rounded-full border border-stone-100 shadow-sm">
                                    <Wallet size={16} className="text-maroon md:w-[18px] md:h-[18px]" />
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] md:text-[10px] text-stone-400 font-bold uppercase tracking-wider">Wallet</span>
                                        <span className="text-xs md:text-sm font-bold text-stone-800">
                                            {walletPoints !== null
                                                ? walletPoints.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
                                                : '...'}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/admin/login" className="p-2 text-stone-600 hover:text-maroon transition-colors hidden md:block">
                                    <User size={22} strokeWidth={1.5} />
                                </Link>
                                <Link href="/cart" className="p-2 text-stone-600 hover:text-maroon transition-colors relative">
                                    <ShoppingBag size={22} strokeWidth={1.5} />
                                    {count > 0 && (
                                        <span className="absolute top-1 right-0 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                            {count}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/50 md:hidden"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm z-[70] bg-white shadow-2xl md:hidden overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="relative h-12 w-36">
                                        <Image
                                            src="/images/logo2.png"
                                            alt="Momento"
                                            fill
                                            className="object-contain object-left"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 text-stone-500 hover:text-maroon rounded-full hover:bg-stone-100"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <nav className="space-y-2">
                                    {[
                                        { href: "/", label: "Home" },
                                        { href: "/products", label: "All Collections" },
                                        { href: "/products?category=wedding", label: "Wedding Gifts" },
                                        { href: "/products?category=baby-shower", label: "Baby Shower Gifts" },
                                        { href: "/about", label: "Our Story" },
                                        { href: "/contact", label: "Contact Us" },
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between p-4 rounded-xl text-stone-700 hover:bg-sandalwood-light hover:text-maroon transition-colors font-medium"
                                        >
                                            {link.label}
                                            <ChevronRight size={18} className="text-stone-400" />
                                        </Link>
                                    ))}
                                </nav>

                                <div className="mt-8 pt-8 border-t border-stone-100">
                                    <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-4">Fast Access</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {adminUser ? (
                                            <>
                                                <div className="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl text-center">
                                                    <Wallet className="text-maroon mb-2" size={20} />
                                                    <span className="text-sm font-bold text-stone-800">
                                                        {walletPoints?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) || '0'}
                                                    </span>
                                                    <span className="text-[10px] text-stone-400 uppercase font-bold">Points</span>
                                                </div>
                                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl text-center">
                                                    <LayoutDashboard className="text-maroon mb-2" size={20} />
                                                    <span className="text-xs font-medium text-stone-600">Dashboard</span>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl text-center">
                                                    <ShoppingBag className="text-maroon mb-2" size={20} />
                                                    <span className="text-xs font-medium text-stone-600">Cart</span>
                                                    {count > 0 && (
                                                        <span className="mt-1 px-2 py-0.5 bg-gold text-white text-[10px] rounded-full font-bold">
                                                            {count} Items
                                                        </span>
                                                    )}
                                                </Link>
                                                <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl text-center">
                                                    <User className="text-maroon mb-2" size={20} />
                                                    <span className="text-xs font-medium text-stone-600">Admin</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
