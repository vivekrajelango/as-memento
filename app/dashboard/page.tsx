"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Package, Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

import { Camera, Edit2 } from "lucide-react";
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

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

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
        const checkAuth = () => {
            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(c => c.trim().startsWith('admin_auth='));
            if (!authCookie) {
                router.push("/admin/login");
            } else {
                fetchProducts();
            }
        };
        checkAuth();
    }, [router]);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("asm-products")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error("Error fetching products:", error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
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

                // Compress/Resize image before saving to DB
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

                    // Get compressed base64
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
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-maroon animate-spin" />
                    <p className="text-stone-500 text-sm font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                    <h1 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
                        <LayoutDashboard className="text-maroon" size={20} />
                        Admin Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleOpenModal()}
                            className="hidden md:flex bg-maroon text-white px-4 py-2 rounded-lg text-sm font-bold items-center gap-2 hover:bg-[#600000] transition-colors"
                        >
                            <Plus size={18} />
                            Add Product
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 transition-all hover:shadow-md flex items-center gap-6">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-stone-500 text-sm mb-0.5">Total Products</p>
                            <h3 className="text-3xl font-bold text-stone-800">{products.length}</h3>
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                    <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                        <h2 className="font-serif font-bold text-lg text-stone-800">Product Management</h2>
                        <button
                            onClick={() => handleOpenModal()}
                            className="md:hidden bg-maroon text-white p-2 rounded-lg shadow-lg"
                            title="Add Product"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {products.length === 0 ? (
                        <div className="p-12 text-center text-stone-500">
                            No products found. Add your first product to get started.
                        </div>
                    ) : (
                        <div className="overflow-x-auto md:overflow-x-visible">
                            <table className="w-full text-left">
                                <thead className="bg-stone-50 text-stone-400 uppercase text-[10px] font-bold tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4 hidden md:table-cell">Category</th>
                                        <th className="px-6 py-4 hidden md:table-cell">Price</th>
                                        <th className="px-6 py-4 hidden md:table-cell">Material</th>
                                        <th className="px-6 py-4 hidden md:table-cell">Bulk</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-stone-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-stone-100 relative overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={product.image || "/images/decor.png"}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-stone-800 leading-tight mb-0.5 text-sm md:text-base">{product.name}</p>
                                                        <p className="text-xs text-stone-400 line-clamp-1 hidden md:block">{product.description || "No description provided."}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="px-2 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium uppercase tracking-tight">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-stone-700 hidden md:table-cell">
                                                ₹{product.price}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-stone-600 hidden md:table-cell">
                                                {product.material || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className={`w-2 h-2 rounded-full inline-block mr-2 ${product.is_bulk_available ? 'bg-green-500' : 'bg-red-400'}`}></span>
                                                <span className="text-sm text-stone-600">{product.is_bulk_available ? "Yes" : "No"}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(product)}
                                                        className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                className="p-2 text-stone-400 hover:text-maroon rounded-full hover:bg-stone-50"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
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
                                        placeholder="Actual Price"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Offer %</label>
                                    <input
                                        type="number"
                                        value={formData.offer_percent}
                                        onChange={(e) => setFormData({ ...formData, offer_percent: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                        placeholder="Discount %"
                                    />
                                </div>
                                <div className="space-y-1.5 opacity-60">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Striked Price</label>
                                    <div className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-100 flex items-center">
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
                                    placeholder="Briefly describe the product..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Material</label>
                                    <input
                                        type="text"
                                        value={formData.material}
                                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                        placeholder="Material"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Size</label>
                                    <input
                                        type="text"
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                        placeholder="Size"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Weight</label>
                                    <input
                                        type="text"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                        placeholder="Weight"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-stone-700 ml-1">Delivery & Returns Information</label>
                                <textarea
                                    value={formData.delivery_info}
                                    onChange={(e) => setFormData({ ...formData, delivery_info: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50 resize-none h-20"
                                    placeholder="Details about shipping time, returns policy..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-stone-700 ml-1">Bulk Orders & Customization Info</label>
                                <textarea
                                    value={formData.bulk_info}
                                    onChange={(e) => setFormData({ ...formData, bulk_info: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50 resize-none h-20"
                                    placeholder="Details about bulk discounts and customization options..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-stone-700 ml-1">Image URL</label>
                                    <select
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all bg-stone-50"
                                    >
                                        <option value="/images/decor.png">Decor</option>
                                        <option value="/images/wedding.png">Wedding</option>
                                        <option value="/images/baby-shower.png">Baby Shower</option>
                                        <option value="/images/housewarming.png">Housewarming</option>
                                        <option value="/images/festivals.png">Festivals</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pt-8">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_bulk_available}
                                            onChange={(e) => setFormData({ ...formData, is_bulk_available: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-maroon"></div>
                                        <span className="ml-3 text-sm font-medium text-stone-700">Bulk Available</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4 sticky bottom-0 bg-white py-4 border-t border-stone-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={actionLoading}
                                    className="flex-1 py-3 px-6 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 py-3 px-6 rounded-xl bg-maroon text-white font-bold hover:bg-[#600000] transition-all flex items-center justify-center gap-2 shadow-lg shadow-maroon/20 disabled:opacity-70"
                                >
                                    {actionLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            {editingProduct ? "Update" : "Save"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
