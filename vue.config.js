const { defineConfig } = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

const isPackLib = process.env.TYPE === "packLib";

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack(config) {
    // monaco plugin is used when building "template/"", no need if we are building "lib/""
    if (!isPackLib) {
      config.plugin("manaco").use(new MonacoWebpackPlugin());
    }
    config.plugin("circular").use(new CircularDependencyPlugin());
  },
});
