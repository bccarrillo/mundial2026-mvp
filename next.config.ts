import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect old Vercel URL to new domain
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'tu-app.vercel.app', // Reemplazar con tu URL actual de Vercel
          },
        ],
        destination: 'https://memories26.com/:path*',
        permanent: true,
      },
      // Force HTTPS
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://memories26.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
