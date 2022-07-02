const cors = require("cors");
var app = require("express")();
const fs = require("fs");
app.use(cors({ origin: "*" }));

var http = require("http").createServer(app);
var io = require("socket.io")(http);
var errorHandler = require("errorhandler");
let hltb = require("howlongtobeat");
let hltbService = new hltb.HowLongToBeatService();
let hltbCache = {};
loadCacheFromFile();
// ...
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

io.on("connection", (socket) => {
  socket.on("message", async (msg) => {
    // console.log("Socket message received", msg);
    let data = JSON.parse(msg);
    if (data.command === "search") {
      let results = [
        {
          gameplayCompletionist: "?",
          gameplayMain: "?",
          gameplayMainExtra: "?",
        },
      ];
      try {
        if (hltbCache[data.query]) {
          results = hltbCache[data.query];
        } else {
          let query = data.query;
          let uncertainty;
          let queryLength;
          //remove ™ and © from query
          query = query.replace(/\u2122/g, "");
          query = query.replace(/\u00A9/g, "");
          results = await hltbService.search(data.query);
          if (results.length === 0) {
            // binary search the highest query length that returns a result
            queryLength = query.length;
            uncertainty = queryLength;
            while (uncertainty > 1) {
              uncertainty = Math.ceil(uncertainty / 2);
              queryLength = queryLength - uncertainty;
              query = data.query.substring(0, queryLength);
              console.log("Trying again with ", query);
              let newResults = await hltbService.search(query);
              if (newResults.length > 0) {
                queryLength = queryLength + uncertainty;
                results = newResults;
              }
            }
          }
          results = { results, unsure: query !== data.query };
          hltbCache[data.query] = results;
          saveCacheToFile();
        }
      } catch (e) {
        console.error(e);
      }
      // console.log(data.query, results);
      socket.emit(
        "message",
        JSON.stringify({
          command: "searchResults",
          query: data.query,
          results,
        })
      );
    }
  });
  // console.log("a user connected");
});

http.listen(3008, () => {
  console.log("listening on *:3005");
});

function saveCacheToFile() {
  fs.writeFileSync("./hltbCache.json", JSON.stringify(hltbCache));
}

function loadCacheFromFile() {
  if (fs.existsSync("./hltbCache.json")) {
    hltbCache = JSON.parse(fs.readFileSync("./hltbCache.json"));
  }
}
