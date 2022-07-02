const ipc = require("node-ipc");

ipc.config.silent = true;

function isSocketTaken(name) {
  return new Promise((resolve) => {
    ipc.connectTo(name, () => {
      ipc.of[name].on("error", () => {
        ipc.disconnect(name);
        resolve(false);
      });

      ipc.of[name].on("connect", () => {
        ipc.disconnect(name);
        resolve(true);
      });
    });
  });
}

async function findOpenSocket() {
  let currentSocket = 1;
  console.log("checking", currentSocket);
  while (await isSocketTaken("gamepass-scraper" + currentSocket)) {
    currentSocket++;
    console.log("checking", currentSocket);
  }
  console.log("found socket", currentSocket);
  return "gamepass-scraper" + currentSocket;
}

module.exports = findOpenSocket;
