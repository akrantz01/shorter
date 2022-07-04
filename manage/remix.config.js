const path = require('node:path');

const GlobalPolyfills = require('@esbuild-plugins/node-globals-polyfill').default;
const { withEsbuildOverride } = require('remix-esbuild-override');

withEsbuildOverride((option, { isServer }) => {
  option.jsxFactory = 'jsx';
  // eslint-disable-next-line no-undef
  option.inject = [path.resolve(__dirname, 'reactShims.ts')];

  if (isServer) option.plugins = [GlobalPolyfills({ buffer: true }), ...option.plugins];

  return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: 'cloudflare-pages',
  server: './server.js',
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ['**/.*'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "functions/[[path]].js",
  // publicPath: "/build/",
};
