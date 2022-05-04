require("isomorphic-fetch");
const { default: AbortController } = require("abort-controller");

// fix for this issue: https://github.com/reduxjs/redux-toolkit/issues/1240
Object.assign(globalThis, { AbortController });

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  distDir: "build/_next",
  webpack(config) {
    return config;
  },
};
