"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const categories = [
    {
        id: "wedding",
        title: "Wedding",
        image: "/images/wedding.png",
    },
    {
        id: "baby-shower",
        title: "Baby Shower",
        image: "/images/baby-shower.png",
    },
    {
        id: "housewarming",
        title: "Housewarming",
        image: "/images/housewarming.png",
    },
    {
        id: "festivals",
        title: "Festivals",
        image: "/images/festivals.png",
    },
    {
        id: "decor",
        title: "Home Decor",
        image: "/images/decor.png",
    }
];

export default function CategorySection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <span className="text-maroon text-xs tracking-widest uppercase font-bold">Collections</span>
                        <h2 className="text-3xl font-serif text-stone-800 mt-2">Shop by Occasion</h2>
                    </div>
                    <Link href="/products" className="text-gold hover:text-maroon transition-colors text-sm font-medium hidden md:block">
                        View All
                    </Link>
                </div>

                <div
                    ref={scrollRef}
                    className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide snap-x"
                >
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/products?category=${category.id}`}
                            className="flex-none w-40 md:w-60 snap-start group cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-stone-100 shadow-sm">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute bottom-4 left-4 text-white font-serif text-lg font-medium opacity-100 transform transform-gpu transition-all">
                                    {/* Optional: Add icon/count */}
                                </div>
                            </div>
                            <h3 className="text-center font-serif text-lg text-stone-800 group-hover:text-maroon transition-colors">
                                {category.title}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
