/*
The function is to catch any error in the async function of controllers
*/

module.exports = fn => {
    return(req,res,next) => {
        fn(req,res,next).catch(next);
    }
}