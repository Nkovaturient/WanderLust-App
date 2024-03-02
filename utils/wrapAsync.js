/**basic err handling and more compact way instead of try and catch block */

module.exports= (fn) =>{
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
};