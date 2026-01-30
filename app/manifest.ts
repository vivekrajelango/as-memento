import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Aarthi Sara Memento',
        short_name: 'Memento',
        description: 'Beautiful Return Gifts for Every Auspicious Occasion',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#D4AF37', // Gold/Sandalwood
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
