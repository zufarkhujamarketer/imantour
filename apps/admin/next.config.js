const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../.."),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
