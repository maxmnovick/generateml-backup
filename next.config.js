/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

// const path = require('path');
// const { merge } = require('webpack-merge');

// module.exports = {
//   webpack: (config, {buildId, dev, isServer, defaultLoaders, webpack }) => {

//     if (isServer) {
//       return merge(config, {
//         entry() {
//           return config.entry().then((entry) => {
//             return Object.assign({}, entry, {'collection.worker': path.resolve(process.cwd(), 'workers/collection.worker.ts')})
//           })
//         }
//       });
//     } else {
//       return config;
//     }
//   }
// }
