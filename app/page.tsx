"use client";

import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Truck, ShieldCheck, Gift, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("asm-products")
        .select("*")
        .limit(4)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setFeaturedProducts(data);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      <CategorySection />

      {/* Featured Products */}
      <section className="py-12 bg-sandalwood-light/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div className="max-w-xl">
              <span className="text-maroon text-xs tracking-widest uppercase font-bold">Trending</span>
              <h2 className="text-3xl font-serif text-stone-800 mt-2">Best Sellers</h2>
              <p className="text-stone-500 mt-2 font-light">
                Our most loved return gifts, curated for quality and tradition.
              </p>
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-gold hover:text-maroon transition-colors text-sm font-medium hidden md:flex">
              View All Products
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-maroon animate-spin" />
              <p className="text-stone-400 text-sm">Loading best sellers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 border border-stone-200 rounded-full text-stone-600 font-medium hover:bg-stone-50">
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-maroon/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-serif text-stone-800 mb-4">Why Choose Momento?</h2>
            <p className="text-stone-500">
              We bring you authentic, handcrafted return gifts that celebrate South Indian tradition with a modern touch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: ShieldCheck, title: "Premium Quality", desc: "Handpicked brass & eco-friendly materials" },
              { icon: Truck, title: "Pan-India Delivery", desc: "Safe shipping for bulk orders across India" },
              { icon: Gift, title: "Custom Packaging", desc: "Personalized branding for your special event" },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-stone-50 hover:bg-sandalwood-light transition-colors duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-gold mb-4 shadow-sm">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-maroon text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Planning a Bulk Order?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg">
            Get exclusive wholesale prices and customization options for weddings and corporate events.
          </p>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-maroon font-bold rounded-full hover:bg-gold hover:text-white transition-all transform hover:scale-105 shadow-xl"
          >
            <MessageCircle size={20} />
            Live Chat
          </a>
        </div>
      </section>
    </div>
  );
}
