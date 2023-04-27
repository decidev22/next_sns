/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.11.0/rollbar.min.js"
    ]
  }
}

module.exports = nextConfig
