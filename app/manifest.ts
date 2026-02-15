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
                src: '/icons/icon-128x128.png',
                sizes: '128x128',
                type: 'image/png',
            },
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-256x256.png',
                sizes: '256x256',
                type: 'image/png',
            },
            {
                src: '/icons/icon-384x384.png',
                sizes: '384x384',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
