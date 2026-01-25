"use client";

import { useCart, CartItem } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleWhatsAppCheckout = async () => {
        if (items.length === 0) return;

        setIsProcessing(true);

        // Check if admin is logged in to deduct points (4% of total)
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(c => c.trim().startsWith('admin_auth='));

        if (authCookie) {
            const value = decodeURIComponent(authCookie.split('=')[1].trim());
            const username = value === "true" ? "admin" : value;
            const deduction = Math.round(total * 0.04); // 4% deduction

            const { data: adminData } = await supabase
                .from('admin_users')
                .select('wallet_balance')
                .eq('username', username)
                .single();

            if (adminData) {
                if (adminData.wallet_balance < deduction) {
                    alert(`Insufficient points! You need ${deduction} points, but you have ${adminData.wallet_balance}.`);
                    setIsProcessing(false);
                    return;
                }

                const { error: updateError } = await supabase
                    .from('admin_users')
                    .update({ wallet_balance: adminData.wallet_balance - deduction })
                    .eq('username', username);

                if (updateError) {
                    console.error("Deduction error:", updateError);
                } else {
                    console.log(`Deducted ${deduction} points for order.`);
                }
            }
        }

        let message = "Hello! I would like to place an order for the following items:\n\n";
        items.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
        });
        message += `\nTotal: ₹${total}\n\nPlease confirm availability and shipping details.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/919884246030?text=${encodedMessage}`, "_blank");
        setIsProcessing(false);
    };

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

                {/* Order Summary */}
                <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-lg border border-gold/20 p-6 md:p-8 sticky top-24">
                        <h2 className="font-serif text-xl font-bold text-stone-800 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 border-b border-stone-100 pb-6">
                            <div className="flex justify-between text-stone-600">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-stone-600">
                                <span>Shipping</span>
                                <span className="text-xs text-stone-400 font-medium self-center">(Calculated on checkout)</span>
                            </div>
                            <div className="flex justify-between text-stone-600">
                                <span>Tax</span>
                                <span className="text-xs text-stone-400 font-medium self-center">(Inclusive)</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <span className="font-bold text-xl text-stone-800">Total</span>
                            <span className="font-bold text-2xl text-maroon">₹{total}</span>
                        </div>

                        <button
                            onClick={handleWhatsAppCheckout}
                            disabled={isProcessing}
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-green-100 disabled:opacity-70 disabled:scale-100"
                        >
                            {isProcessing ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <MessageCircle size={20} />
                            )}
                            {isProcessing ? "Processing..." : "Confirm Order"}
                        </button>

                        <p className="text-xs text-stone-400 text-center mt-4 leading-relaxed">
                            By clicking Confirm, you will be redirected to WhatsApp to send your order details directly to our team.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
