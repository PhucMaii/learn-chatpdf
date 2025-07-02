import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard/',
        '/private/',
        '/_next/',
        '/chat/*',
        '/projects/*/edit',
      ],
    },
    sitemap: 'https://learnpdf.ca/sitemap.xml',
  };
}
