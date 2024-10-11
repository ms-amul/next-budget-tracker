const withPWA = require("next-pwa")({
  dest: "public", // This is the correct place for the PWA configuration
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
});
