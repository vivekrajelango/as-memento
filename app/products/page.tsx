"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["All", "Wedding", "Baby Shower", "Housewarming", "Festivals", "Decor"];
const materials = ["Brass", "German Silver", "Wood", "Jute", "Glass"];

// Extended Mock Data
const products = [
    { id: "1", name: "Brass Diya Set", price: 120, category: "Decor", image: "/images/decor.png", isBulkAvailable: true },
    { id: "2", name: "Jute Potli Bags", price: 45, category: "Eco-Friendly", image: "/images/housewarming.png", isBulkAvailable: true },
    { id: "3", name: "Kumkum Box", price: 85, category: "Wedding", image: "/images/baby-shower.png", isBulkAvailable: true },
    { id: "4", name: "German Silver Plate", price: 250, category: "Housewarming", image: "/images/wedding.png", isBulkAvailable: true },
    { id: "5", name: "Thamboolam Bag", price: 35, category: "Wedding", image: "/images/wedding.png", isBulkAvailable: true },
    { id: "6", name: "Peacock Lamp", price: 450, category: "Decor", image: "/images/festivals.png", isBulkAvailable: false },
    { id: "7", name: "Sandalwood Incense Holder", price: 150, category: "Decor", image: "/images/decor.png", isBulkAvailable: true },
    { id: "8", name: "Miniature Brass Pot", price: 95, category: "Baby Shower", image: "/images/baby-shower.png", isBulkAvailable: true },
];

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(p => p.category === activeCategory || (activeCategory === "Wedding" && p.category === "Eco-Friendly")); // Simple logic for demo

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-16 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-serif font-bold text-stone-800">Collections</h1>
                        <button className="flex items-center gap-2 text-stone-600 text-sm font-medium border border-stone-200 px-3 py-1.5 rounded-full hover:border-maroon hover:text-maroon transition-colors">
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>

                    {/* Horizontal Category Scroll */}
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                    ? "bg-maroon text-white shadow-md shadow-maroon/20"
                                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <p className="text-sm text-stone-500 mb-6">Showing {filteredProducts.length} items</p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {filteredProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
