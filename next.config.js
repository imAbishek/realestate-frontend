/** @type {import('next').NextConfig} */

// Prod MinIO host — set NEXT_PUBLIC_MINIO_HOST on your server (e.g. "192.168.1.10" or "minio.yourdomain.com")
// NEXT_PUBLIC_MINIO_PROTOCOL defaults to "http", set to "https" if behind SSL
// NEXT_PUBLIC_MINIO_PORT defaults to "9000"
const minioHost     = process.env.NEXT_PUBLIC_MINIO_HOST
const minioProtocol = process.env.NEXT_PUBLIC_MINIO_PROTOCOL || 'http'
const minioPort     = process.env.NEXT_PUBLIC_MINIO_PORT     || '9000'

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      // Dev MinIO (docker-compose port 9000)
      { protocol: 'http',  hostname: 'localhost', port: '9000' },
      // Dev local file upload (backend at :8080/uploads/)
      { protocol: 'http',  hostname: 'localhost', port: '8080' },
      // Prod MinIO — only added when env var is set
      ...(minioHost ? [{ protocol: minioProtocol, hostname: minioHost, port: minioPort }] : []),
    ],
  },
}
module.exports = nextConfig
