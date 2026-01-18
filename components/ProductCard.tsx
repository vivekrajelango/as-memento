"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    isBulkAvailable?: boolean;
}

interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
        >
            <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100 mb-3 shadow-sm hover:shadow-md transition-shadow">
                    {product.isBulkAvailable && (
                        <span className="absolute top-2 left-2 z-10 bg-emerald text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full shadow-sm">
                            Bulk Order
                        </span>
                    )}

                    <button className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-stone-500 hover:text-maroon transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                        <Heart size={16} />
                    </button>

                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Quick Add Overlay (Desktop) */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
                        <button className="w-full bg-white text-stone-900 py-2 rounded-xl text-sm font-medium shadow-lg hover:bg-sandalwood transition-colors flex items-center justify-center gap-2">
                            <ShoppingBag size={16} />
                            Quick View
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="font-serif text-stone-900 text-lg group-hover:text-gold transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="text-stone-500 text-sm">{product.category}</p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="font-medium text-maroon">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-stone-400">Min. 50 pcs</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
