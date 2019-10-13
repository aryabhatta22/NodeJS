const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 1; //this sets the thread pool size ( 4 by default )

setTimeout(() => console.log("Timer 1 finsihed"), 0);

fs.readFile("test-file.txt", () => {
  console.log("IO finished");
  console.log("------------------");

  setTimeout(() => console.log("Timer 2 finsihed"), 0);
  setTimeout(() => console.log("Timer 3 finsihed"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));

  process.nextTick(() => console.log("Process.nextTick"));
  //this will executed in batches of Thread pool size
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encyrpted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encyrpted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encyrpted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encyrpted");
  });
});

setImmediate(() => console.log("Immediate 1 finished"));
console.log("Hello from top level code1;");
