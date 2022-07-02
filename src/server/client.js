import io from "socket.io-client";

var socket = io("http://localhost:3008");

var dataCallback = null;
var refreshCallbacks = {};

socket.on("message", function (msg) {
  console.log("Socket message received", msg);
  let data = JSON.parse(msg);
  if (data.command === "searchResults" && typeof refreshCallbacks[data.query] === "function") {
    refreshCallbacks[data.query](data.results);
    delete refreshCallbacks[data.query];
  }
});

export function search(query) {
  return new Promise((resolve) => {
    socket.send(
      JSON.stringify({
        command: "search",
        query,
      })
    );
    refreshCallbacks[query] = resolve;
  });
}
