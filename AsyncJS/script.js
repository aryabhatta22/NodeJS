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

/*

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

  */

/************* Async await ************/
/*
const getDogPic = async () => {
  try {
    const data = await redFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    ); //since get function return a promise
    console.log(res.body.message);

    await writeFilePro('dog-img.txt', res.body.message);
    console.log('Random dog image saved to file');
  } catch (err) {
    console.log(err);
    throw err;
  }

  return '2: getdogpic fun finished';
};

*/

// getDogPic();

/* the weird part */

/*

//Part 1

console.log('1. will get the dog pic ');
getDogPic().then(x => {
  console.log(x);
  console.log('3: got the dog pic');
});


//Part 2 
(async () => {
  try {
    console.log('1. will get the dog pic ');
    const x = await getDogPic();
    console.log(x);
    console.log('3: got the dog pic');
  } catch (err) {
    console.log('error!!!!!!!!');
  }
})();


*/

/************* handling  multiple promises *************/

const getDogPic = async () => {
  try {
    const data = await redFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res2Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Promise, res2Promise, res3Promise]);
    const imgs = all.map(el => el.body.message);
    console.log(imgs);

    await writeFilePro('dog-img.txt', imgs.join('\n'));
    console.log('Random dog image saved to file');
  } catch (err) {
    console.log(err);
    throw err;
  }

  return '2: getdogpic fun finished';
};

(async () => {
  try {
    console.log('1. will get the dog pic ');
    const x = await getDogPic();
    console.log(x);
    console.log('3: got the dog pic');
  } catch (err) {
    console.log('error!!!!!!!!');
  }
})();
