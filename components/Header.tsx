"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, Heart, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                    <Link href="/" className="relative h-16 w-48 md:w-36 flex-shrink-0">
                        <Image
                            src="/images/logo1.png"
                            alt="Momento"
                            fill
                            className="object-contain"
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
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-stone-600 hover:text-maroon transition-colors">
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                        <button className="p-2 text-stone-600 hover:text-maroon transition-colors hidden md:block">
                            <Heart size={22} strokeWidth={1.5} />
                        </button>
                        <Link href="/cart" className="p-2 text-stone-600 hover:text-maroon transition-colors relative">
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            <span className="absolute top-1 right-0 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                0
                            </span>
                        </Link>
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
                                    <div className="relative h-10 w-28">
                                        <Image
                                            src="/images/logo1.png"
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
                                        <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl text-center">
                                            <Heart className="text-maroon mb-2" size={20} />
                                            <span className="text-xs font-medium text-stone-600">Wishlist</span>
                                        </Link>
                                        <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl text-center">
                                            <ShoppingBag className="text-maroon mb-2" size={20} />
                                            <span className="text-xs font-medium text-stone-600">Cart</span>
                                        </Link>
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
