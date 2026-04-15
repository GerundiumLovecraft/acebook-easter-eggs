require("dotenv").config();

const app = require("./app.js");
const { connectToDatabase } = require("./db/db.js");
const http = require("http");
const { initSocket } = require("./socket");

const server = http.createServer(app);

initSocket(server);

function listenForRequests() {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log("Now listening on port", port);
  });
}

connectToDatabase().then(() => {
  listenForRequests();
});
