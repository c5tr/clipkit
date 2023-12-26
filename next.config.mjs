/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/upload/finish": ["./bin/**/*"],
    },
  },
};

export default nextConfig;
