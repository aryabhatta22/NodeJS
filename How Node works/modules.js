// console.log(arguments);
// console.log(require("module").wrapper);

//module.exports
const C = require("./test-module-1");
calc = new C();

console.log(calc.add(1, 2));

//exports
const calc2 = require("./test-module-2");
console.log(calc2.add(1, 2));
//or by using destructuring
const { add, multiply, div } = require("./test-module-2");
console.log(add(1, 2));

//Caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
