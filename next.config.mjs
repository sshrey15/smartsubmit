/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/api/upload',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/pdf',
            },
          ],
        },
      ]
    },
  }
  
  export default nextConfig;