
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

// <=========== Routing using url  & creating simple API===========>

const http = require('http');
const url = require('url');
const fs = require('fs');

//this is the top level code and needs to be called only once hence blocking code style is used
const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const dataObject = JSON.parse(data);



  //this will called at evrey routes 
const server = http.createServer((req, res) => {
  // console.log(req.url);   // will provide url requested in each routes

  const pathname=req.url;

  if(pathname==='/' || pathname=== '/home')
    res.end("This is the  Home page");
  else if (pathname === '/api') {
      res.writeHead(200, {'Content-type': 'application/json'});
      res.end(data);
 
  }
  else {
    res.writeHead(404, {
      'Content-type': 'text/hmtl',
      'my_own_header': 'hello world'
    });
    res.end("<h1> Welcome to home page <h1>");
  }

});

server.listen(3000, '127.0.0.1', () => {
  console.log("Listening to port 3000");
});
