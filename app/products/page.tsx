"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const categories = ["All", "Wedding", "Baby Shower", "Housewarming", "Festivals", "Decor", "Eco-Friendly"];

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("asm-products")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) {
                setProducts(data);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(p => p.category === activeCategory);

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
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 text-maroon animate-spin" />
                        <p className="text-stone-400 text-sm">Discovering collections...</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-stone-500 mb-6">Showing {filteredProducts.length} items</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {filteredProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

