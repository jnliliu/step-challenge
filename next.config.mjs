/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => [
        {
            source: "/",
            destination: "/stake",
            permanent: true,
        },
    ],
};

export default nextConfig;
