/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'http',  hostname: 'localhost', port: '9000' },
      // Local dev: backend serves uploaded images from localhost:8080/uploads/
      { protocol: 'http',  hostname: 'localhost', port: '8080' },
    ],
  },
}
module.exports = nextConfig
