"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

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

        try {
            const { data, error } = await supabase.rpc('login_admin', {
                p_username: username,
                p_password: password
            });

            if (error) throw error;

            if (data) {
                document.cookie = `admin_auth=${username}; path=/; max-age=86400`; // Store username
                router.push("/dashboard");
            } else {
                setError("Invalid username or password");
                setLoading(false);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
                <div className="pt-10 pb-6 px-8 text-center bg-white">
                    <div className="relative w-56 h-20 mx-auto mb-6">
                        <Image
                            src="/images/logo.svg"
                            alt="Momento Admin"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-stone-800">Admin Portal</h1>
                    <p className="text-stone-500 text-sm mt-2">Enter your credentials to manage the store</p>
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
