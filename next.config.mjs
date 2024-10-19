/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
            'puppeteer',
            'puppeteer-extra',
            'puppeteer-extra-plugin-stealth',
        ],
        serverMinification: false, // required by DEFER platform
    },
};

export default nextConfig;