import { defineConfig } from "vite";
import { resolve } from "path";
import { existsSync, mkdirSync, copyFileSync, cpSync } from "fs";

const iconDir: string = resolve(__dirname, "dist/icons");
if (!existsSync(iconDir)) {
  mkdirSync(iconDir, { recursive: true });
}

const getManifestPath = (): string => {
  const browser = process.env.BROWSER || "chrome";

  if (browser.toLowerCase() === "firefox") {
    return resolve(__dirname, "src/firefox-manifest.json");
  }

  return resolve(__dirname, "src/manifest.json");
};

const copyManifestPlugin = () => {
  return {
    name: "copy-manifest-plugin",
    closeBundle: () => {
      const manifestPath = getManifestPath();
      console.log(`Using manifest from: ${manifestPath}`);

      copyFileSync(manifestPath, resolve(__dirname, "dist/manifest.json"));

      if (existsSync(resolve(__dirname, "src/icons/"))) {
        cpSync(resolve(__dirname, "src/icons/"), resolve(__dirname, "dist/icons/"), {
          recursive: true
        });
      }
    }
  };
};

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background/background.ts")
      },
      output: {
        entryFileNames: "[name].js",
        format: "es"
      }
    }
  },
  plugins: [copyManifestPlugin()],
  resolve: {
    extensions: [".ts", ".js"]
  }
});
