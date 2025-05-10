const path = require("path");
const fs = require("fs");

const iconDir = path.resolve(__dirname, "dist/icons");
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

const getManifestPath = () => {
  const browser = process.env.BROWSER || "chrome";

  if (browser.toLowerCase() === "firefox") {
    return path.resolve(__dirname, "src/firefox-manifest.json");
  }

  return path.resolve(__dirname, "src/manifest.json");
};

module.exports = {
  mode: "production",
  entry: {
    background: "./src/background/background.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap("CopyManifestPlugin", () => {
          const manifestPath = getManifestPath();
          console.log(`Using manifest from: ${manifestPath}`);

          fs.copyFileSync(manifestPath, path.resolve(__dirname, "dist/manifest.json"));

          if (fs.existsSync(path.resolve(__dirname, "src/icons/"))) {
            fs.cpSync(path.resolve(__dirname, "src/icons/"), path.resolve(__dirname, "dist/icons/"), {
              recursive: true
            });
          }
        });
      }
    }
  ]
};
