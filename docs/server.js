const express = require("express")
const app = express()
const w = require("express-ws")(app);
const port = 12500;

let next_id = 0;
var online  = 0;
let clients = {};
let messages = [];

function post(msg) {
  messages.push(msg);
  for (var id in clients) {
    clients[id].send(msg);
  }
};

//var time = 0;
//setInterval(() => {
  //if (time % 8 === 0) post("GM: ?");
  //if (time % 8 === 1) post("GM: .");
  //++time;
  //console.log(time);
//}, 1000);

app.ws("/chat", function(ws, req) {
  console.log("New connection. Online: " + (++online) + ".");

  var playersReady = 0;
  const cid = ++next_id;
  clients[cid] = ws;

  for (var i = 0; i < messages.length; ++i) {
    clients[cid].send(messages[i]);
  }

  ws.on("message", function(msg) {
    console.log("Message: " + msg);
    let message = msg.slice(msg.indexOf(":") + 1).split(' ').join('');

    if (message.length > 0) {
      switch (message) {
        case "/finish":
          messages = [];
          // TODO: stops the game for everyone
          break; 
        case "/ready":
          playersReady++;
          if (playersReady == online) {
            console.log(">> Game is ready to start!");
            // TODO: send message to everyone that the game can start
            post(msg);
          } else {
            post("Waiting for players");
          }
        default:
          post(msg);
      }
      
    }
    
  });

  ws.on("close", function() {
    console.log("Disconnection. Online: " + (--online) + ".");
    delete clients[cid];
  });
});

app.get("*", (req, res) => {
  res.sendFile("/docs" + (req.path === "/" ? "/index.html" : req.path), {root: __dirname + "/.."});
  
  //res.send("Hello World!");
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
