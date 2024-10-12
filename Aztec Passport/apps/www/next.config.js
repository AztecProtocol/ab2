await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default config;
