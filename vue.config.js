module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      // mainProcessWatch: ["src"],
      builderOptions: {
        productName: "How Long To Beat Game Pass",
        extraResources: [
          {
            from: "./src/extraResources/",
            to: "extraResources",
            filter: ["**/*"],
          },
        ],
        appId: "io.dedra.howlongtobeatgamepass",
        files: ["dist/**/*.{js,css,html,ttf}"],
        directories: {
          buildResources: "./",
        },
        mac: {
          category: "public.app-category.developer-tools",
          artifactName: "${productName}-${version}-${os}-${arch}.${ext}",
          hardenedRuntime: true,
          entitlementsInherit: "build/entitlements.mac.inherit-plist",
        },
        linux: {
          target: "AppImage",
          artifactName: "${productName}-${version}-${os}-${arch}.${ext}",
          category: "Development",
        },
        win: {
          target: "nsis",
          artifactName: "${productName}-${version}-${os}-${arch}.${ext}",
        },
        publish: {
          provider: "github",
          repo: "howlongtobeat-gamepass",
          owner: "skymen",
          releaseType: "release",
        },
        // afterSign: "./build/afterSignHook.js",
      },
      nodeIntegration: true,
    },
    nodeIntegration: true,
  },
};
