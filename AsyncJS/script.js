const fs = require('fs');
const superagent = require('superagent');

/************* Promises *************/

const redFilePro = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find the data');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject('Could not write on file');
      resolve('Success');
    });
  });
};

/************* chained promises ************/

redFilePro(`${__dirname}/dog.txt`)
  .then(data => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`); //since get function return a promise
  })
  .then(res => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    //since writeFilePro does not return a meaningful promise hence no parameter
    console.log('Random dog image saved');
  })
  .catch(err => {
    console.log(err.message);
  });
