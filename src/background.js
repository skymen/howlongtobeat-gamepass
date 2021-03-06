import { app, protocol, BrowserWindow, contextBridge, ipcRenderer } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

const isDevelopment = process.env.NODE_ENV !== "production";
let { fork } = require("child_process");
const path = require("path");
let findOpenSocket = require("./find-open-socket");
let serverProcess;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    autoHideMenuBar: true,
    title: "How Long To Beat Game Pass",
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
    },
  });
  console.log(process.env.ELECTRON_NODE_INTEGRATION);
  // win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
  //   callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
  // });

  // win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       "Access-Control-Allow-Origin": ["*"],
  //       ...details.responseHeaders,
  //     },
  //   });
  // });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  let serverSocket = await findOpenSocket();
  createWindow();
  createBackgroundProcess(serverSocket);
});

function createBackgroundProcess(socketName) {
  let config = ["--subprocess", app.getVersion(), socketName];
  if (isDevelopment) {
    serverProcess = fork("./src/extraResources/server.js", config);
  } else {
    const serverPath = path.join(path.dirname(__dirname), "extraResources", "server.js");
    // dialog.showMessageBoxSync({
    //   message: serverPath
    // })
    serverProcess = fork(serverPath, config);
  }

  serverProcess.on("message", (msg) => {
    console.log(msg);
  });
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
