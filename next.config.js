const withPWA = require('next-pwa')({
  dest: 'public', // The folder where the service worker will be generated
  register: true, // Automatically register the service worker
  skipWaiting: true, // Automatically take control of the page after the service worker is updated
});

module.exports = withPWA({
  // Your existing Next.js config
  reactStrictMode: true,
});
