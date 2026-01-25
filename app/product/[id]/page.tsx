"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Share2, MessageCircle, ChevronDown, Check, Truck, Shield, ShoppingBag, Loader2, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";

export default function ProductDetail() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { items, addItem, updateQuantity } = useCart();
    const [activeImage, setActiveImage] = useState(0);
    const [openSection, setOpenSection] = useState<string | null>("details");

    // Find current quantity in cart
    const cartItem = items.find(item => item.id.toString() === id.toString());
    const quantity = cartItem ? cartItem.quantity : 0;

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("asm-products")
                .select("*")
                .eq("id", id)
                .single();

            if (!error && data) {
                setProduct(data);
            } else {
                router.push("/products");
            }
            setLoading(false);
        };
        if (id) fetchProduct();
    }, [id, router]);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            category: product.category
        });
    };

    const handleIncrease = () => updateQuantity(id, quantity + 1);
    const handleDecrease = () => updateQuantity(id, quantity - 1);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-maroon animate-spin" />
                <p className="text-stone-400 text-sm">Loading product details...</p>
            </div>
        );
    }

    if (!product) return null;

    const images = [product.image]; // In database we currently only have one image field

    return (
        <div className="min-h-screen bg-white pb-32 md:pb-20">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 p-4 flex justify-between items-center pointer-events-none">
                <button
                    onClick={() => router.back()}
                    className="pointer-events-auto p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-stone-700 hover:text-maroon"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex gap-2 pointer-events-auto">
                    <button className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-stone-700 hover:text-maroon">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row container mx-auto md:py-12 md:px-4 gap-8 lg:gap-16">
                {/* Gallery Section */}
                <div className="w-full md:w-1/2">
                    <div className="relative aspect-[4/5] md:aspect-square w-full bg-stone-100 md:rounded-3xl overflow-hidden">
                        <Image
                            src={images[activeImage] || images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    {/* Thumbnails (only if multiple) */}
                    {images.length > 1 && (
                        <div className="flex gap-4 mt-4 px-4 md:px-0 overflow-x-auto">
                            {images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={cn("relative w-20 h-20 rounded-lg overflow-hidden border-2", activeImage === idx ? "border-maroon" : "border-transparent")}
                                >
                                    <Image src={img} alt="" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 px-4 md:px-0 pt-6 md:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-maroon text-xs font-bold uppercase tracking-wider bg-maroon/10 px-3 py-1 rounded-full">In Stock</span>
                        <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mt-4 mb-2">{product.name}</h1>

                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-3xl font-medium text-maroon">₹{product.price.toLocaleString('en-IN')}</span>
                            {product.offer_percent > 0 && (
                                <>
                                    <span className="text-lg text-stone-400 line-through">
                                        ₹{Math.round(product.price / (1 - product.offer_percent / 100)).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-sm font-medium text-emerald-600">{product.offer_percent}% OFF</span>
                                </>
                            )}
                        </div>

                        {/* Desktop Add to Cart / Quantity Selection */}
                        <div className="hidden md:flex gap-4 mb-8">
                            {quantity > 0 ? (
                                <div className="flex items-center bg-stone-100 rounded-full p-1 border border-stone-200">
                                    <button
                                        onClick={handleDecrease}
                                        className="w-12 h-12 flex items-center justify-center text-maroon hover:bg-white rounded-full transition-all shadow-sm"
                                    >
                                        <Minus size={20} strokeWidth={3} />
                                    </button>
                                    <span className="w-16 text-center font-serif font-bold text-xl text-stone-900">{quantity}</span>
                                    <button
                                        onClick={handleIncrease}
                                        className="w-12 h-12 flex items-center justify-center text-maroon hover:bg-white rounded-full transition-all shadow-sm"
                                    >
                                        <Plus size={20} strokeWidth={3} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 max-w-sm bg-maroon hover:bg-[#600000] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.02]"
                                >
                                    <ShoppingBag size={20} />
                                    Add to Cart
                                </button>
                            )}
                        </div>

                        <p className="text-stone-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Accordion Sections */}
                        <div className="space-y-4 mb-8">
                            {[
                                { id: "details", title: "Product Details" },
                                { id: "delivery", title: "Delivery & Returns" },
                                { id: "bulk", title: "Bulk Orders & Customization" }
                            ].map((section) => (
                                <div key={section.id} className="border-b border-stone-200 pb-4">
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full flex justify-between items-center text-left font-serif font-medium text-lg text-stone-800"
                                    >
                                        {section.title}
                                        <ChevronDown size={20} className={cn("transition-transform", openSection === section.id && "rotate-180")} />
                                    </button>
                                    <AnimatePresence>
                                        {openSection === section.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-4 text-sm text-stone-500 space-y-2 whitespace-pre-line">
                                                    {section.id === "details" && (
                                                        <p>
                                                            {product.material && <><strong>Material:</strong> {product.material}<br /></>}
                                                            {product.size && <><strong>Size:</strong> {product.size}<br /></>}
                                                            {product.weight && <><strong>Weight:</strong> {product.weight}<br /></>}
                                                            {!product.material && !product.size && !product.weight && "Handcrafted premium quality return gift."}
                                                        </p>
                                                    )}
                                                    {section.id === "delivery" && <p>{product.delivery_info || "Standard delivery within 3-5 business days across India."}</p>}
                                                    {section.id === "bulk" && <p>{product.bulk_info || "Special pricing available for bulk orders. Contact us for custom branding and packaging options."}</p>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
                                <Shield className="text-gold" size={20} />
                                <span className="text-xs font-medium text-stone-600">Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
                                <Truck className="text-gold" size={20} />
                                <span className="text-xs font-medium text-stone-600">Pan-India Delivery</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Fixed Bottom Action Bar (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 md:hidden z-50 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
                {quantity > 0 ? (
                    <div className="flex items-center justify-between bg-stone-50 rounded-full p-1 border border-stone-100 shadow-inner">
                        <button
                            onClick={handleDecrease}
                            className="w-12 h-12 flex items-center justify-center text-maroon bg-white rounded-full shadow-sm"
                        >
                            <Minus size={20} strokeWidth={3} />
                        </button>
                        <span className="font-serif font-bold text-xl text-stone-900">{quantity}</span>
                        <button
                            onClick={handleIncrease}
                            className="w-12 h-12 flex items-center justify-center text-maroon bg-white rounded-full shadow-sm"
                        >
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-gradient-to-r from-maroon to-[#600000] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-maroon/20"
                    >
                        <ShoppingBag size={18} />
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
}
