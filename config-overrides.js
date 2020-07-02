const {InjectManifest} = require('workbox-webpack-plugin');

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.plugins = config.plugins.map((plugin) => {
    if (plugin.constructor.name === "GenerateSW") {
      return new InjectManifest({
        swSrc: "./src/sw.js",
        swDest: "service-worker.js",
      });
    }
    return plugin;
  });
  return config;
};
