import { supabase } from "@/lib/supabaseClient";
import ProductDetailClient from "@/components/ProductDetailClient";

export async function generateStaticParams() {
    const { data: products } = await supabase
        .from("asm-products")
        .select("id");

    if (!products) return [];

    return products.map((product: any) => ({
        id: product.id.toString(),
    }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ProductDetailClient id={id} />;
}
