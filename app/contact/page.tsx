"use client";

import { motion } from "framer-motion";
import { MessageCircle, MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic
        alert("Thank you for your enquiry! We will contact you shortly.");
    };

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <div className="bg-maroon text-white py-12 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px] opacity-20"></div>
                <div className="container mx-auto relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">Get in Touch</h1>
                    <p className="text-white/80 max-w-xl mx-auto">
                        Have a question about bulk orders or customization? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-sandalwood-light rounded-full text-maroon">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-stone-900">Phone</h3>
                                        <p className="text-stone-500">+91 98765 43210</p>
                                        <p className="text-xs text-stone-400 mt-1">Mon - Sat, 9am - 7pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-sandalwood-light rounded-full text-maroon">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-stone-900">Email</h3>
                                        <p className="text-stone-500">hello@momento-gifts.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-sandalwood-light rounded-full text-maroon">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-stone-900">Visit Us</h3>
                                        <p className="text-stone-500">
                                            12, Temple Street, T. Nagar,<br />
                                            Chennai, Tamil Nadu - 600017
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="font-semibold text-stone-900 mb-4">Quick Chat</h3>
                                <a
                                    href="https://wa.me/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-200"
                                >
                                    <MessageCircle size={20} />
                                    Live Chat
                                </a>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">Send an Enquiry</h2>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50" placeholder="e.g. Priya" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                                <input type="tel" className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50" placeholder="+91" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Occasion</label>
                                <select className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50">
                                    <option>Wedding</option>
                                    <option>Baby Shower</option>
                                    <option>Housewarming</option>
                                    <option>Corporate</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Message / Requirements</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50" placeholder="Tell us about the quantity and customization needed..." required></textarea>
                            </div>

                            <button type="submit" className="w-full bg-maroon text-white font-bold py-3 rounded-xl hover:bg-[#600000] transition-colors flex items-center justify-center gap-2">
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
