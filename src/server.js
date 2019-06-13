const express = require("express")
const app = express()
const w = require("express-ws")(app);
const port = 8000;

let next_id = 0;
var online  = 0;
let clients = {};
let messages = [];

app.ws("/chat", function(ws, req) {
  console.log("New connection. Online: " + (++online) + ".");

  const cid = ++next_id;
  clients[cid] = ws;

  for (var i = 0; i < messages.length; ++i) {
    clients[cid].send(messages[i]);
  }

  ws.on("message", function(msg) {
    console.log("Message: " + msg);
    if (msg.slice(msg.indexOf(":") + 1).length > 0) {
      messages.push(msg);
      for (var id in clients) {
        clients[id].send(msg);
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
