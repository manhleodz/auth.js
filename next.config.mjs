/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "lh3.googleusercontent.com",
            },
            {
                hostname: "cdn-icons-png.freepik.com"
            },
            {
                hostname: "loremflickr.com"
            },
            {
                hostname: "firebasestorage.googleapis.com"
            }
        ],
    }, 
    experimental: { appDir: true },
    reactStrictMode: false,
    webpack(config) {
        config.experiments = { ...config.experiments, topLevelAwait: true }
        return config
    },
};

export default nextConfig;