"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            <div className="bg-stone-100 p-6 rounded-full mb-6">
                <Heart size={48} className="text-stone-300" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-stone-800 mb-2">Your Wishlist is Empty</h1>
            <p className="text-stone-500 mb-8 text-center max-w-xs">
                Save items you love here to check them out later.
            </p>
            <Link
                href="/products"
                className="px-8 py-3 bg-maroon text-white font-medium rounded-full hover:bg-gold transition-colors"
            >
                Start Browsing
            </Link>
        </div>
    );
}
