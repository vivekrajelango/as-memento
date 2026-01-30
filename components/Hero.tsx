"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const FALLBACK_SLIDES = [
    {
        id: 1,
        image_url: "/images/hero.png",
        tag: "Premium Return Gifts",
        title: "Beautiful Gifts for Every",
        highlight: "Auspicious",
        suffix: "Occasion.",
        description: "Handcrafted brass, wood, and eco-friendly gifts that leave a lasting impression on your guests.",
        link: "/products",
        cta_text: "Browse Gifts"
    },
    {
        id: 2,
        image_url: "/images/housewarming.png",
        tag: "Housewarming Specials",
        title: "Warm Welcomes with",
        highlight: "Traditional",
        suffix: "Grace.",
        description: "Celebrate new beginnings with our curated collection of divine idols and decor items.",
        link: "/products?category=housewarming",
        cta_text: "Shop Housewarming"
    },
    {
        id: 3,
        image_url: "/images/wedding.png",
        tag: "Wedding Collections",
        title: "Make Your Big Day",
        highlight: "Unforgettable",
        suffix: ".",
        description: "Exquisite tambulya bags and return gifts that add a touch of elegance to your wedding.",
        link: "/products?category=wedding",
        cta_text: "Explore Wedding"
    },
];

export default function Hero() {
    const [slides, setSlides] = useState<any[]>(FALLBACK_SLIDES);
    const [current, setCurrent] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            const { data, error } = await supabase
                .from('asm-banners')
                .select('*')
                .order('order_rank', { ascending: true });

            if (!error && data && data.length > 0) {
                setSlides(data);
            }
            setIsLoaded(true);
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (!isLoaded && slides.length === 0) return null; // Or a skeleton loader

    return (
        <section className="relative h-[80vh] md:h-[600px] w-full overflow-hidden bg-sandalwood-light">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={slides[current].image_url}
                        alt={slides[current].tag || "Banner"}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center items-start text-white pt-20">
                <AnimatePresence mode="wait">
                    <div key={current} className="max-w-3xl">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block px-3 py-1 mb-4 text-xs md:text-sm tracking-widest uppercase border border-white/30 backdrop-blur-sm rounded-full bg-white/10"
                        >
                            {slides[current].tag}
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4 text-shadow-sm"
                        >
                            {slides[current].title} <span className="text-gold-light italic">{slides[current].highlight}</span> {slides[current].suffix}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="text-lg md:text-xl text-white/90 mb-8 max-w-lg font-light leading-relaxed"
                        >
                            {slides[current].description}
                        </motion.p>

                        {/* Button removed for now */}
                        {/* <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                        >
                            <Link
                                href={slides[current].link}
                                className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-black bg-gold rounded-full hover:bg-gold-dark transition-colors duration-300 shadow-lg"
                            >
                                {slides[current].cta_text}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </motion.div> */}
                    </div>
                </AnimatePresence>
            </div>

            {/* Dots navigation */}
            <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-gold" : "w-2 bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
