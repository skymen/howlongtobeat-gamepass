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
      },
      nodeIntegration: true,
    },
    nodeIntegration: true,
  },
};
