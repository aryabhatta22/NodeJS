const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  //     //Solution 1 (will cause problem with large files)
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) console.log(err);
  //     res.end(data);
  //   });

  //solution 2 (Streams)
  //   const readable = fs.createReadStream("test-filee.txt");
  //   readable.on("data", chunk => {
  //     res.write(chunk);
  //   });

  //   readable.on("end", () => {
  //     res.end(); //this will end the response stream to write
  //   });

  //   readable.on("error", err => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end("File not found !");
  //   });

  //Solution 3 ( Used because reading speed is faster than sending henche creating a backpressure in stream )
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res); //SYNTAX: readableSource.pipe(WritableSource);
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Listening to port 3000 ......");
});
