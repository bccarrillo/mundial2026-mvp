// Site configuration for memories26.com
export const SITE_CONFIG = {
  name: "Memories 26",
  description: "Turn your World Cup 2026 memories into NFT",
  url: process.env.NODE_ENV === 'production' 
    ? 'https://memories26.com'
    : 'http://localhost:3000',
  email: "social@memories26.com",
  social: {
    tiktok: "@memories26",
    instagram: "@memories26", 
    twitter: "@Memories26",
    youtube: "Memories 26"
  }
}

export const SEO_CONFIG = {
  defaultTitle: "Memories 26 - World Cup 2026 NFT",
  titleTemplate: "%s | Memories 26",
  description: "Turn your World Cup 2026 memories into NFT - Create your digital certificate",
  canonical: "https://memories26.com",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://memories26.com',
    siteName: 'Memories 26',
    images: [
      {
        url: 'https://memories26.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Memories 26 - World Cup 2026 NFT',
      },
    ],
  },
  twitter: {
    handle: '@Memories26',
    site: '@Memories26',
    cardType: 'summary_large_image',
  },
}