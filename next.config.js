require('dotenv').config();

const webpack = require('webpack');
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const appURL = JSON.stringify(process.env.APP_URL);
console.log('config.js', { APP_URL: process.env.APP_URL }, { apiKey }, { appURL });

module.exports = {
  webpack: config => {
      console.log('inside configs')
    const env = { API_KEY: apiKey, APP_URL: appURL };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
};
