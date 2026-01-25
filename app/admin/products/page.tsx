"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Package, Plus, Pencil, Trash2, X, Save, Loader2, Camera, Edit2, Wallet, ShoppingBag, LayoutDashboard } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    offer_percent: number;
    category: string;
    image: string;
    is_bulk_available: boolean;
    material: string;
    delivery_info?: string;
    bulk_info?: string;
    size?: string;
    weight?: string;
    created_at?: string;
    updated_at?: string;
}

export default function AdminProducts() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number>(0);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        offer_percent: "0",
        category: "Wedding",
        image: "/images/decor.png",
        is_bulk_available: true,
        material: "Brass",
        delivery_info: "",
        bulk_info: "",
        size: "",
        weight: ""
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
                    fetchProducts(),
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

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from("asm-products")
            .select("*")
            .order("id", { ascending: false });

        if (!error) {
            setProducts(data || []);
        }
    };

    const handleLogout = () => {
        document.cookie = "admin_auth=; path=/; max-age=0";
        router.push("/admin/login");
    };

    const handleOpenModal = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price.toString(),
                offer_percent: (product.offer_percent || 0).toString(),
                category: product.category,
                image: product.image,
                is_bulk_available: product.is_bulk_available,
                material: product.material || "Brass",
                delivery_info: product.delivery_info || "",
                bulk_info: product.bulk_info || "",
                size: product.size || "",
                weight: product.weight || ""
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                offer_percent: "0",
                category: "Wedding",
                image: "/images/decor.png",
                is_bulk_available: true,
                material: "Brass",
                delivery_info: "Dispatched in 2-3 days. Free shipping on orders above ₹999.",
                bulk_info: "Custom engraving available for orders 50+ qty. Get up to 30% off on bulk orders.",
                size: "4 inches",
                weight: "150g"
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
                    setFormData(prev => ({ ...prev, image: compressedBase64 }));
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
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            offer_percent: parseInt(formData.offer_percent),
            category: formData.category,
            image: formData.image,
            is_bulk_available: formData.is_bulk_available,
            material: formData.material,
            delivery_info: formData.delivery_info,
            bulk_info: formData.bulk_info,
            size: formData.size,
            weight: formData.weight,
            updated_at: new Date().toISOString()
        };

        let error;
        if (editingProduct) {
            const { error: updateError } = await supabase
                .from("asm-products")
                .update(payload)
                .eq("id", editingProduct.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("asm-products")
                .insert([payload]);
            error = insertError;
        }

        if (error) {
            alert("Error saving product: " + error.message);
        } else {
            setIsModalOpen(false);
            fetchProducts();
        }
        setActionLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setActionLoading(true);
        const { error } = await supabase
            .from("asm-products")
            .delete()
            .eq("id", id);

        if (error) {
            alert("Error deleting product: " + error.message);
        } else {
            fetchProducts();
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
                            <Package className="text-maroon" size={20} />
                            Manage Products
                        </h1>
                        <nav className="hidden md:flex items-center gap-4 border-l border-stone-200 pl-6">
                            <Link href="/admin/products" className="text-maroon font-bold text-sm">Products</Link>
                            <Link href="/admin/orders" className="text-stone-500 hover:text-maroon font-medium text-sm transition-colors">Orders</Link>
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
                            Add Product
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
                        <h2 className="font-serif font-bold text-lg text-stone-800">Product Inventory</h2>
                    </div>

                    {products.length === 0 ? (
                        <div className="p-12 text-center text-stone-500">
                            No products found. Add your first product to get started.
                        </div>
                    ) : (
                        <div className="divide-y divide-stone-100">
                            {products.map((product) => (
                                <div key={product.id} className="p-4 md:p-6 hover:bg-stone-50/50 transition-colors flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-stone-100 relative overflow-hidden flex-shrink-0 border border-stone-200 shadow-sm">
                                            <Image
                                                src={product.image || "/images/decor.png"}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-stone-800 truncate text-sm md:text-base">{product.name}</p>
                                                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[9px] font-bold uppercase tracking-tight whitespace-nowrap">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-stone-500">
                                                <span className="font-bold text-maroon text-sm">₹{product.price}</span>
                                                <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                                                <span className="flex items-center gap-1">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${product.is_bulk_available ? 'bg-green-500' : 'bg-red-400'}`}></div>
                                                    {product.is_bulk_available ? "Bulk Available" : "Single Unit"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleOpenModal(product)}
                                            className="p-2.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
                                            title="Edit Product"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                                            title="Delete Product"
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
                                {editingProduct ? "Edit Product" : "Add New Product"}
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
                            {/* Use common form clusters from original dashboard */}
                            <div className="flex justify-center pb-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-2xl bg-stone-100 overflow-hidden border-2 border-stone-100 group-hover:border-maroon/20 transition-all shadow-inner relative">
                                        <Image
                                            src={formData.image}
                                            alt="Preview"
                                            fill
                                            className={cn("object-cover transition-opacity", uploadingImage && "opacity-30")}
                                        />
                                        {uploadingImage && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-maroon animate-spin" />
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
                                    <label className="text-sm font-bold text-stone-700 ml-1">Product Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                        placeholder="e.g. Traditional Brass Diya"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                    >
                                        <option value="Wedding">Wedding</option>
                                        <option value="Baby Shower">Baby Shower</option>
                                        <option value="Housewarming">Housewarming</option>
                                        <option value="Festivals">Festivals</option>
                                        <option value="Decor">Decor</option>
                                        <option value="Eco-Friendly">Eco-Friendly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Offer %</label>
                                    <input
                                        type="number"
                                        value={formData.offer_percent}
                                        onChange={(e) => setFormData({ ...formData, offer_percent: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Striked Price</label>
                                    <div className="w-full px-4 py-1 rounded-xl border border-stone-200 bg-stone-100 flex items-center justify-center p-3">
                                        ₹{formData.price && formData.offer_percent ? Math.round(parseFloat(formData.price) / (1 - parseInt(formData.offer_percent) / 100)) : "0"}
                                    </div>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Delivery Info</label>
                                    <input
                                        type="text"
                                        value={formData.delivery_info}
                                        onChange={(e) => setFormData({ ...formData, delivery_info: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Bulk Info</label>
                                    <input
                                        type="text"
                                        value={formData.bulk_info}
                                        onChange={(e) => setFormData({ ...formData, bulk_info: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                    />
                                </div>
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
                                    {editingProduct ? "Update Product" : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
