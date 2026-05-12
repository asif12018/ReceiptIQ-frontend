import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

if (!process.env.BACKEND_URL) {
  throw new Error(
    'Missing environment variable: BACKEND_URL. ' +
    'Add it to your Vercel project settings (Settings → Environment Variables).'
  );
}

const nextConfig: NextConfig = {
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard/admin',
        permanent: true,
      },
    ];
  },
};

export default withPWA(nextConfig);
