module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      // mainProcessWatch: ["src"],
      builderOptions: {
        appId: "io.skymen.howlongtobeatgamepass",
        productName: "How Long To Beat Game Pass",
        extraResources: [
          {
            from: "./src/extraResources/",
            to: "extraResources",
            filter: ["**/*"],
          },
        ],
        mac: {
          category: "public.app-category.developer-tools",
        },
        dmg: {
          icon: false,
        },
        linux: {
          target: "AppImage",
          category: "Development",
        },
        win: {
          target: "nsis",
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
