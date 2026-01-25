"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/products");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-maroon animate-spin" />
                <p className="text-stone-500 text-sm font-medium">Redirecting to admin panel...</p>
            </div>
        </div>
    );
}
