// const EventEmmiter = require("events");
// // const myEmmiter = new EventEmmiter(); //creating EventEmmiter class for e-comm site

// //recommended format to create Event Emmiter class
// class Sales extends EventEmmiter {
//   constructor() {
//     super();
//   }
// }

// const myEmmiter = new Sales();

// //event listeners
// myEmmiter.on("newSale", () => {
//   console.log("There is new sale");
// });

// myEmmiter.on("newSale", () => {
//   console.log("Customer name jonas");
// });

// myEmmiter.on("newSale", sale => {
//   console.log(`there are now ${sale} items left.`);
// });
// //emmiting event

// // myEmmiter.emit("newSale");
// myEmmiter.emit("newSale", 9);

//-------------- event listener without any emitter ---------------

const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  console.log(req.url);
  console.log("Request 1 made");
  res.end("Request recieved");
});

server.on("request", (req, res) => {
  console.log("Request 2 made");
});

server.on("close", () => {
  console.log("Server closed");
});

server.listen(3000, "127.0.0.1", () => {
  console.log("waiting for request");
});
