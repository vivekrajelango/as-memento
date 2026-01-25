"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, MessageCircle, Loader2, CheckCircle2, ShoppingBag as ShoppingBagIcon } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [lastOrderId, setLastOrderId] = useState("");

    // Form State
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        mobile: "+91 ",
        address: ""
    });

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        if (!customerInfo.name || !customerInfo.mobile || !customerInfo.address) {
            alert("Please fill in all delivery details.");
            return;
        }

        // Validate 10-digit mobile (stripping +91 and spaces)
        const pureMobile = customerInfo.mobile.replace("+91", "").replace(/\s/g, "");
        if (pureMobile.length !== 10 || !/^\d+$/.test(pureMobile)) {
            alert("Please enter a valid 10-digit mobile number after +91.");
            return;
        }

        setIsProcessing(true);

        const orderId = `ASM-${Math.floor(1000 + Math.random() * 9000)}`;

        const payload = {
            order_id: orderId,
            customer_name: customerInfo.name,
            customer_mobile: customerInfo.mobile,
            delivery_address: customerInfo.address,
            items: items,
            total_amount: total,
            status: 'pending'
        };

        const { error } = await supabase
            .from('asm-orders')
            .insert([payload]);

        if (error) {
            alert("Error placing order: " + error.message);
            setIsProcessing(false);
        } else {
            setLastOrderId(orderId);
            setOrderSuccess(true);
            clearCart();

            // Success Fireworks
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                // @ts-ignore
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                // @ts-ignore
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }
        setIsProcessing(false);
    };

    if (orderSuccess) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle2 size={48} className="text-emerald-600" />
                </motion.div>
                <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">Order Placed Successfully!</h1>
                <p className="text-stone-500 mb-2">Your order ID is <span className="font-bold text-maroon">{lastOrderId}</span></p>
                <p className="text-stone-500 mb-8 max-w-md">
                    We have received your order. Our team will contact you on WhatsApp for confirmation and payment details.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/products"
                        className="px-8 py-3 bg-maroon text-white font-medium rounded-full hover:bg-maroon/90 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                    <Trash2 size={40} className="text-stone-300" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-stone-800 mb-2">Your cart is empty</h1>
                <p className="text-stone-500 mb-8 max-w-md">
                    Looks like you haven't added any return gifts yet. Browse our collections to find something special.
                </p>
                <Link
                    href="/products"
                    className="px-8 py-3 bg-maroon text-white font-medium rounded-full hover:bg-maroon/90 transition-colors"
                >
                    Browse Collections
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Cart Items List */}
                <div className="flex-grow">
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-stone-50 border-b border-stone-100 text-sm font-medium text-stone-500 uppercase tracking-wider">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-center">Total</div>
                        </div>

                        <div className="divide-y divide-stone-100">
                            {items.map((item) => (
                                <div key={item.id} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    <div className="col-span-12 md:col-span-6 flex gap-4">
                                        <div className="relative w-24 h-24 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">{item.name}</h3>
                                            <p className="text-sm text-stone-500 mb-2">{item.category}</p>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 text-sm flex items-center gap-1 hover:text-red-600 w-fit"
                                            >
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile: Row for Price, Qty, Total */}
                                    <div className="col-span-12 md:hidden flex justify-between items-center bg-stone-50 p-3 rounded-lg mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Price</span>
                                            <span className="text-stone-800 font-medium">₹{item.price}</span>
                                        </div>

                                        <div className="flex items-center border border-stone-200 bg-white rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1.5 hover:bg-stone-50 text-stone-600 transition-colors"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1.5 hover:bg-stone-50 text-stone-600 transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>

                                        <div className="flex flex-col text-right">
                                            <span className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Total</span>
                                            <span className="font-bold text-maroon">₹{item.price * item.quantity}</span>
                                        </div>
                                    </div>

                                    {/* Desktop: Grid Columns */}
                                    <div className="col-span-2 hidden md:flex justify-center items-center">
                                        <span className="text-stone-800">₹{item.price}</span>
                                    </div>

                                    <div className="col-span-2 hidden md:flex justify-center items-center">
                                        <div className="flex items-center border border-stone-200 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-stone-50 text-stone-600 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-stone-50 text-stone-600 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-span-2 hidden md:flex justify-center items-center">
                                        <span className="font-bold text-maroon">₹{item.price * item.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={clearCart}
                            className="text-stone-500 hover:text-maroon text-sm underline transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>

                {/* Checkout Section */}
                <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-lg border border-gold/20 p-6 md:p-8 sticky top-24">
                        <h2 className="font-serif text-xl font-bold text-stone-800 mb-6">Delivery Details</h2>

                        <form onSubmit={handlePlaceOrder} className="space-y-4 mb-8">
                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none bg-stone-50 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Mobile Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={customerInfo.mobile}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val.startsWith("+91 ")) {
                                            setCustomerInfo(prev => ({ ...prev, mobile: val }));
                                        } else if (val.startsWith("+91")) {
                                            setCustomerInfo(prev => ({ ...prev, mobile: "+91 " + val.slice(3) }));
                                        }
                                    }}
                                    placeholder="+91 9876543210"
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none bg-stone-50 text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Delivery Address</label>
                                <textarea
                                    required
                                    value={customerInfo.address}
                                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                                    placeholder="House No, Street, Landmark, City, Pincode"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none bg-stone-50 text-sm resize-none"
                                />
                            </div>

                            <div className="pt-4 border-t border-stone-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-xl text-stone-800">Total</span>
                                    <span className="font-bold text-2xl text-maroon">₹{total}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-maroon text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-maroon/20 disabled:opacity-70 disabled:scale-100"
                                >
                                    {isProcessing ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <ShoppingBagIcon size={20} />
                                    )}
                                    {isProcessing ? "Placing Order..." : "Place Order Now"}
                                </button>
                            </div>
                        </form>

                        <p className="text-xs text-stone-400 text-center leading-relaxed">
                            Once placed, you will receive a unique Order ID to track your gifts.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
