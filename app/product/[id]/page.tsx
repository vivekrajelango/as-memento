"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Share2, MessageCircle, ChevronDown, Check, Truck, Shield, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

// Mock Data lookup (in real app, fetch from API)
const products: Record<string, any> = {
    "1": { name: "Brass Diya Set", price: 120, description: "Traditional brass diya set, perfect for Diwali and wedding return gifts. Handcrafted by artisans from Kumbakonam.", images: ["/images/decor.png", "/images/festivals.png"] },
    // Fallback for demo
    "default": { name: "Premium Return Gift", price: 250, description: "Elegant and eco-friendly return gift suitable for all auspicious occasions.", images: ["/images/wedding.png"] }
};

export default function ProductDetail() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const product = products[id] || products["default"];

    const { addItem } = useCart();
    const [activeImage, setActiveImage] = useState(0);
    const [openSection, setOpenSection] = useState<string | null>("details");
    const [isAdded, setIsAdded] = useState(false);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleAddToCart = () => {
        addItem({
            id: id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1,
            category: "Return Gift"
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

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
                            src={product.images[activeImage] || product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    {/* Thumbnails (only if multiple) */}
                    {product.images.length > 1 && (
                        <div className="flex gap-4 mt-4 px-4 md:px-0 overflow-x-auto">
                            {product.images.map((img: string, idx: number) => (
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
                            <span className="text-3xl font-medium text-maroon">₹{product.price}</span>
                            <span className="text-lg text-stone-400 line-through">₹{Math.floor(product.price * 1.2)}</span>
                            <span className="text-sm font-medium text-emerald-600">20% OFF</span>
                        </div>

                        {/* Desktop Add to Cart Button */}
                        <div className="hidden md:flex gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                className={cn(
                                    "flex-1 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.02]",
                                    isAdded ? "bg-emerald-600" : "bg-maroon hover:bg-[#600000]"
                                )}
                            >
                                {isAdded ? (
                                    <>
                                        <Check size={20} />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={20} />
                                        Add to Cart
                                    </>
                                )}
                            </button>
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
                                                <div className="pt-4 text-sm text-stone-500 space-y-2">
                                                    {section.id === "details" && <p>Material: Premium Brass<br />Size: 4 inches<br />Weight: 150g</p>}
                                                    {section.id === "delivery" && <p>Dispatched in 2-3 days.<br />Free shipping on orders above ₹999.</p>}
                                                    {section.id === "bulk" && <p>Custom engraving available for orders 50+ qty.<br />Get up to 30% off on bulk orders.</p>}
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

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 md:hidden z-50 flex gap-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
                <button
                    onClick={handleAddToCart}
                    className={cn(
                        "w-full text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-maroon/30 transition-colors",
                        isAdded ? "bg-emerald-600" : "bg-gradient-to-r from-maroon to-[#600000]"
                    )}
                >
                    {isAdded ? (
                        <>
                            <Check size={18} />
                            Added
                        </>
                    ) : (
                        <>
                            <ShoppingBag size={18} />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
