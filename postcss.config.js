const path = require("path");

module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-assets": {
      loadPaths: [path.join(__dirname, "src/assets/images")]
    }
  }
};
