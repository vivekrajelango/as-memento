import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'South Indian Gifts',
        short_name: 'Gifts',
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
