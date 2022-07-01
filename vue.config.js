module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      // mainProcessWatch: ["src"],
      builderOptions: {
        productName: "Game Pass Scraper",
      },
      nodeIntegration: true,
    },
  },
};
