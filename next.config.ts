/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ปิด static generation สำหรับหน้าที่มีปัญหา
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // api: {
  //   bodyParser: {
  //     sizeLimit: '100mb', 
  //   },
  //   responseLimit: false,
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',       
        pathname: '/**', 
      },
      {
        protocol: 'http',
        hostname: '**', 
        port: '',      
        pathname: '/**', 
      },
    ],
  },
};

module.exports = nextConfig;
