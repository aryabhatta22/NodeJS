
// <=========== Blocking or Synchronous code ===========>

  // const  fs= require('fs');

  // let textdata=fs.readFileSync('./input.txt','utf-8' );

  // const textEdit= `this is overwritten after ${textdata}.\n \n Editted on ${Date.now()}.`;

  // fs.writeFileSync('./input.txt', textEdit);
  // textdata=fs.readFileSync('./input.txt', 'utf-8');
  // console.log(textdata);

// <=========== Non blocking or Asynchronous code ===========>

    // const fs = require('fs');

        // <-- Part 1 -->

    // fs.readFile('./input.txt', 'utf-8', (err, data) => {
    //   console.log(data);  //this will execute later
    // });

    // console.log("After readFile statement");  //this will execute first
        
        // <-- Part 2 Callback Hell -->

    // fs.readFile('./input2.txt', 'utf-8', (err, data1) => {

    //   if(err) return console.log("Error!!");

    //   fs.readFile(`./${data1}`, 'utf-8', (err, data2) => {
    //     console.log("Call back ends here");
    //     console.log(data2);
    //     fs.writeFile('./append1.txt', `Appended data: ${data2}`,'utf-8', err => {
    //       console.log("Data has been written");
    //     });
    //   });
    // });

    // console.log("This is after callback hell");


// <=========== Creating own server using http ===========>

// const http = require('http');

// const server = http.createServer((req, res) => {
//   res.end("Hello from the server");
// });

// server.listen(3000, '127.0.0.1', () => {
//   console.log("Listening to port 3000");
// });

// <=========== Routing using url ===========>

const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // console.log(req.url);   // will provide url requested in each routes

  const pathname=req.url;

  if(pathname==='/' || pathname=== '/home')
    res.end("This is the  Home page");
  else {
    res.writeHead(404, {
      'Content-type': 'text/hmtl',
      'my_own_header': 'hello world'
    });
    res.end("<h1> Welcome to home page <h1>");
  }
  res.end("Hello from the server");
});

server.listen(3000, '127.0.0.1', () => {
  console.log("Listening to port 3000");
});
