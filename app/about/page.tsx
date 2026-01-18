import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <span className="text-maroon text-xs tracking-widest uppercase font-bold">Our Story</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mt-4 mb-6">Preserving Tradition through Gifts</h1>
                <p className="text-lg text-stone-600 leading-relaxed font-light">
                    Momento was born out of a love for South Indian heritage. We believe that return gifts are not just objects, but a gesture of gratitude and a memory carried forward.
                </p>
            </div>

            <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-16 shadow-2xl">
                <Image
                    src="/images/festivals.png"
                    alt="Traditional Lamp"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                    <p className="font-serif text-2xl italic">"Every gift tells a story."</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-stone-800 mb-6">Handcrafted with Love</h2>
                    <p className="text-stone-600 mb-6 leading-relaxed">
                        We work directly with artisans from Kumbakonam to Moradabad to bring you authentic brassware, eco-friendly jute products, and traditional decor. Every piece is inspected for quality and finish.
                    </p>
                    <p className="text-stone-600 leading-relaxed">
                        Whether it is a grand wedding or an intimate housewarming, we ensure your return gifts reflect your taste and tradition.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square rounded-2xl bg-stone-100 relative overflow-hidden">
                        <Image src="/images/housewarming.png" alt="Craft 1" fill className="object-cover" />
                    </div>
                    <div className="aspect-square rounded-2xl bg-stone-100 relative overflow-hidden mt-8">
                        <Image src="/images/wedding.png" alt="Craft 2" fill className="object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
}
