import nextPWA from 'next-pwa';

// Export the Next.js configuration with PWA support
/** @type {import('next').NextConfig} */
const nextConfig = nextPWA({
  dest: 'public', // Specify where to generate the service worker and related files
  register: true, // Automatically registers the service worker
  skipWaiting: true, // Instructs the service worker to take control of the page as soon as it's installed
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
});

export default nextConfig;
