"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, ArrowRight } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Hardcoded credentials as requested for the prototype
        if (username === "admin" && password === "admin123") {
            // Simulate API call/processing
            setTimeout(() => {
                // Set a simple cookie for "auth" - In a real app use HttpOnly cookies via Server Actions/API
                document.cookie = "admin_auth=true; path=/; max-age=86400"; // Expires in 1 day
                router.push("/dashboard");
            }, 800);
        } else {
            setTimeout(() => {
                setError("Invalid username or password");
                setLoading(false);
            }, 500);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
                <div className="bg-maroon p-8 text-center">
                    <div className="relative w-32 h-12 mx-auto mb-4 grayscale brightness-0 invert opacity-90">
                        <Image
                            src="/images/logo1.png"
                            alt="Momento Admin"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-white text-xl font-serif font-bold">Admin Portal</h1>
                    <p className="text-maroon-100 text-sm mt-1">Please log in to continue</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5 ml-1">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-stone-400" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-stone-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm py-2 px-4 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-maroon text-white font-bold py-3 rounded-xl hover:bg-[#600000] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-maroon/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    Login <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-stone-400">
                            Protected System. Authorized Access Only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
