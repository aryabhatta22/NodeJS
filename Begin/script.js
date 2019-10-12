
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
const replaceTemplate = require('./modules/replaceTemplate');

//this is the top level code and needs to be called only once hence blocking code style is used
const Overview = fs.readFileSync(`${__dirname}/Overview.html`, 'utf-8');
const Card = fs.readFileSync(`${__dirname}/Card.html`, 'utf-8');
const Product = fs.readFileSync(`${__dirname}/Product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const dataObject = JSON.parse(data);



  //this will called at evrey routes 
const server = http.createServer((req, res) => {
  // console.log(req.url);   // will provide url requested in each routes
  // console.log(url.parse(req.url, true));  //this will parse the query part i.e. variables after ? in url eg. ../product?id=0 will give id

  const {query, pathname } = url.parse(req.url, true);  //will parse the query & pathname from url.parse and store in variable with same name (called destructuring)

  //Home
  if(pathname==='/' || pathname=== '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html'});
    const cardsHtml = dataObject.map( el => replaceTemplate(Card, el)).join('');   //this will loop through api and map to an array having each
                                                                              // cards in array. Func replaceTemplaate is defined above                                                    
    const output = Overview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

  //Product
  }
  else if(pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html'});
    const Curproduct = dataObject[query.id];
    const output = replaceTemplate(Product, Curproduct);
    // console.log(query);
    res.end(output);

  //API
  }
  else if (pathname === '/api') {
      res.writeHead(200, {'Content-type': 'application/json'});
      res.end(data);
  
  //Not found
  }
  else {
    res.writeHead(404, {
      'Content-type': 'text/hmtl',
      'my_own_header': 'hello world'
    });
    res.end("Page not found!!");
  }

});

server.listen(3000, '127.0.0.1', () => {
  console.log("Listening to port 3000");
});
