/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf2json'],
  },

  reactStrictMode: true,
  swcMinify: true,

  // Uncoment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });
    config.resolve.alias.canvas = false;
    return config;
  },
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
  rewrites: async () => {
    return [
      {
        source: '/api/fastapi/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8080/api/:path*'
            : '/api/fastapi',
      },
      // {
      //   source: '/docs',
      //   destination:
      //     process.env.NODE_ENV === 'development'
      //       ? 'http://127.0.0.1:8080/docs'
      //       : '/api/docs',
      // },
      // {
      //   source: '/openapi.json',
      //   destination:
      //     process.env.NODE_ENV === 'development'
      //       ? 'http://127.0.0.1:8080/openapi.json'
      //       : '/api/openapi.json',
      // },
    ];
  },
};

module.exports = nextConfig;
