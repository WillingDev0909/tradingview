const express = require("express");
const app = express();
const PORT = 3050;
var socket = require("socket.io-client")("wss://feed.genesiv.org", {
  transports: ["websocket"],
});
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const broadCastServer = require("socket.io");
const broadCastServerIO = broadCastServer(server);

/**
 * master server connect.
 */
socket.on("connect", () => {
  console.log("Connected to server");
  socket.emit("Tick:Data", {
    key: "f|jqaGcb|M%g(/#`w=p i!;4~*|7,xh&#1mt`g+J,x>OLk`tga?;Z-M02Z9>u B*",
  });

  socket.on("Tick:Data", (data) => {
    broadCastServerIO.emit("continuousData", data);
  });
});

/**
 * master server error
 */
socket.on("error", (e) => {
  console.log("ERROR >>>", e);
});

/**
 * master server disconnect.
 */
socket.on("disconnect", () => {
  console.log("Socket Disconnected");
});
/*------------------------------------------------------------------------*/
/*---send data to the client---*/
broadCastServerIO.on("connection", (socket) => {
  console.log("Local Server connected");

  socket.on("sendMessage", (message) => {
    console.log("sendMessage", message);
    broadCastServerIO.emit("sendMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
