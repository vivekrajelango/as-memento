"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Image as ImageIcon, Plus, Pencil, Trash2, X, Save, Loader2, Camera, Wallet, LayoutDashboard } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Banner {
    id: number;
    tag: string;
    title: string;
    highlight: string;
    suffix: string;
    description: string;
    image_url: string;
    link: string;
    order_rank: number;
    created_at?: string;
}

export default function AdminBanners() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number>(0);

    // Form State
    const [formData, setFormData] = useState({
        tag: "",
        title: "",
        highlight: "",
        suffix: "",
        description: "",
        image_url: "",
        link: "",
        order_rank: 0
    });

    useEffect(() => {
        const checkAuth = async () => {
            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(c => c.trim().startsWith('admin_auth='));
            if (!authCookie) {
                router.push("/admin/login");
            } else {
                const username = decodeURIComponent(authCookie.split('=')[1].trim());
                setLoading(true);
                await Promise.all([
                    fetchBanners(),
                    fetchWalletBalance(username === "true" ? "admin" : username)
                ]);
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    const fetchWalletBalance = async (username: string) => {
        let { data, error } = await supabase
            .from('admin_users')
            .select('wallet_balance')
            .eq('username', username)
            .single();

        if (error || !data) {
            const { data: fallbackData } = await supabase.from('admin_users').select('wallet_balance').limit(1).single();
            data = fallbackData;
        }

        if (data) setWalletBalance(parseFloat(data.wallet_balance));
    };

    const fetchBanners = async () => {
        const { data, error } = await supabase
            .from("asm-banners")
            .select("*")
            .order("order_rank", { ascending: true });

        if (!error) {
            setBanners(data || []);
        }
    };

    const handleLogout = () => {
        document.cookie = "admin_auth=; path=/; max-age=0";
        router.push("/admin/login");
    };

    const handleOpenModal = (banner: Banner | null = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                tag: banner.tag || "",
                title: banner.title || "",
                highlight: banner.highlight || "",
                suffix: banner.suffix || "",
                description: banner.description || "",
                image_url: banner.image_url || "",
                link: banner.link || "",
                order_rank: banner.order_rank || 0
            });
        } else {
            setEditingBanner(null);
            setFormData({
                tag: "New Event",
                title: "Title Here",
                highlight: "Highlight",
                suffix: "Suffix",
                description: "Short description about the event or offer.",
                image_url: "/images/hero.png",
                link: "/products",
                order_rank: banners.length + 1
            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64String = event.target?.result as string;
                const img = new (window as any).Image();
                img.src = base64String;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                    setFormData(prev => ({ ...prev, image_url: compressedBase64 }));
                    setUploadingImage(false);
                };
            };
            reader.readAsDataURL(file);
        } catch (error: any) {
            alert("Error processing image: " + error.message);
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);

        const payload = {
            tag: formData.tag,
            title: formData.title,
            highlight: formData.highlight,
            suffix: formData.suffix,
            description: formData.description,
            image_url: formData.image_url,
            link: formData.link,
            order_rank: formData.order_rank,
            // created_at: new Date().toISOString() // Let DB handle default
        };

        let error;
        if (editingBanner) {
            const { error: updateError } = await supabase
                .from("asm-banners")
                .update(payload)
                .eq("id", editingBanner.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("asm-banners")
                .insert([payload]);
            error = insertError;
        }

        if (error) {
            alert("Error saving banner: " + error.message);
        } else {
            setIsModalOpen(false);
            fetchBanners();
        }
        setActionLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;

        setActionLoading(true);
        const { error } = await supabase
            .from("asm-banners")
            .delete()
            .eq("id", id);

        if (error) {
            alert("Error deleting banner: " + error.message);
        } else {
            fetchBanners();
        }
        setActionLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="w-8 h-8 text-maroon animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
                            <ImageIcon className="text-maroon" size={20} />
                            Manage Banners
                        </h1>
                        <nav className="hidden md:flex items-center gap-4 border-l border-stone-200 pl-6">
                            <Link href="/admin/products" className="text-stone-500 hover:text-maroon font-medium text-sm transition-colors">Products</Link>
                            <Link href="/admin/orders" className="text-stone-500 hover:text-maroon font-medium text-sm transition-colors">Orders</Link>
                            <Link href="/admin/banners" className="text-maroon font-bold text-sm">Banners</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/wallet" className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100/50 transition-colors">
                            <Wallet size={16} className="text-amber-600" />
                            <span className="text-sm font-bold text-amber-900">{walletBalance.toLocaleString()} pts</span>
                        </Link>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-maroon text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#600000] transition-colors"
                        >
                            <Plus size={18} />
                            Add Banner
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                    <div className="p-6 border-b border-stone-100">
                        <h2 className="font-serif font-bold text-lg text-stone-800">Homepage Banners</h2>
                    </div>

                    {banners.length === 0 ? (
                        <div className="p-12 text-center text-stone-500">
                            No banners found. Add your first banner to get started.
                        </div>
                    ) : (
                        <div className="divide-y divide-stone-100">
                            {banners.map((banner) => (
                                <div key={banner.id} className="p-4 md:p-6 hover:bg-stone-50/50 transition-colors flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-24 h-16 md:w-32 md:h-20 rounded-xl bg-stone-100 relative overflow-hidden flex-shrink-0 border border-stone-200 shadow-sm">
                                            <Image
                                                src={banner.image_url || "/images/hero.png"}
                                                alt={banner.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute font-bold text-white bg-black/50 p-1 text-xs bottom-0 right-0 rounded-tl-lg">
                                                #{banner.order_rank}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-stone-800 truncate text-sm md:text-base">{banner.title} <span className="text-maroon italic">{banner.highlight}</span> {banner.suffix}</p>
                                            </div>
                                            <div className="text-xs text-stone-500 line-clamp-1 mb-1">
                                                {banner.description}
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[9px] font-bold uppercase tracking-tight whitespace-nowrap">
                                                {banner.tag}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleOpenModal(banner)}
                                            className="p-2.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
                                            title="Edit Banner"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                                            title="Delete Banner"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !actionLoading && setIsModalOpen(false)}
                    />
                    <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                            <h2 className="font-serif font-bold text-xl text-stone-800">
                                {editingBanner ? "Edit Banner" : "Add New Banner"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={actionLoading}
                                className="p-2 text-stone-400 hover:text-maroon rounded-full"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                            <div className="flex justify-center pb-6">
                                <div className="relative group w-full max-w-md aspect-video">
                                    <div className="w-full h-full rounded-2xl bg-stone-100 overflow-hidden border-2 border-stone-100 group-hover:border-maroon/20 transition-all shadow-inner relative">
                                        <Image
                                            src={formData.image_url || "/images/hero.png"}
                                            alt="Preview"
                                            fill
                                            className={cn("object-cover transition-opacity", uploadingImage && "opacity-30")}
                                        />
                                        {uploadingImage && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-maroon animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 p-2.5 bg-maroon text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                                        <Camera size={18} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            disabled={uploadingImage}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Tag (Top Label)</label>
                                    <input
                                        type="text"
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                        placeholder="e.g. Premium Return Gifts"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.order_rank}
                                        onChange={(e) => setFormData({ ...formData, order_rank: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5 md:col-span-1">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Main Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                        placeholder="First part"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-1">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Highlight (Italic/Gold)</label>
                                    <input
                                        type="text"
                                        value={formData.highlight}
                                        onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                        placeholder="Featured text"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-1">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Suffix (End)</label>
                                    <input
                                        type="text"
                                        value={formData.suffix}
                                        onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                        placeholder="Last part"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-stone-700 ml-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50 resize-none h-24"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-stone-700 ml-1">Link URL</label>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                    placeholder="/products"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-8 py-2.5 rounded-xl bg-maroon text-white font-bold flex items-center gap-2 hover:bg-[#600000] disabled:opacity-70 transition-all shadow-lg shadow-maroon/20"
                                >
                                    {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingBanner ? "Update Banner" : "Save Banner"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
