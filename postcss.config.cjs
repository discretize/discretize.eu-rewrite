const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  plugins: [
    require("autoprefixer"),
    require("cssnano"),
    postcssPresetEnv({ browsers: "last 2 versions" }),
  ],
};
