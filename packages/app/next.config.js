const path = require('path')
const withImages = require('next-images')
const withPlugins = require('next-compose-plugins')

function resolve (...args) {
  return path.resolve( __dirname, '..', '..', ...args)
}

const withTM = require('next-transpile-modules')([
  resolve('packages'),
  resolve('vendor/polkadot-apps/packages'),
  resolve('node_modules/react-syntax-highlighter/dist')
])

module.exports = withPlugins([
  withTM,
  withImages
])