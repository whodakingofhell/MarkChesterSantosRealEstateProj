import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Philippine Skyland MGT and DEVT OPC (PPSMDO)',
    short_name: 'Philippine Skyland',
    description: 'Enterprise-grade real estate platform for licensed Philippine brokers and appraisers. Manage properties, track transactions, and grow your client base.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
