"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative h-[80vh] md:h-[600px] w-full overflow-hidden bg-sandalwood-light">
            {/* Background Image / Pattern */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero.png"
                    alt="Traditional South Indian Return Gifts"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center items-start text-white pt-20">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block px-3 py-1 mb-4 text-xs md:text-sm tracking-widest uppercase border border-white/30 backdrop-blur-sm rounded-full bg-white/10"
                >
                    Premium Return Gifts
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4 max-w-2xl text-shadow-sm"
                >
                    Beautiful Gifts for Every <span className="text-gold-light italic">Auspicious</span> Occasion.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-white/90 mb-8 max-w-lg font-light leading-relaxed"
                >
                    Handcrafted brass, wood, and eco-friendly gifts that leave a lasting impression on your guests.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-gold hover:bg-gold/90 text-white font-medium rounded-full transition-all hover:scale-105 shadow-lg shadow-gold/20"
                    >
                        Browse Gifts
                        <ArrowRight size={18} />
                    </Link>
                    {/* <a
                        href="https://wa.me/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium rounded-full transition-all hover:scale-105"
                    >
                        <MessageCircle size={18} />
                        WhatsApp Order
                    </a> */}
                </motion.div>
            </div>
        </section>
    );
}
