
/*
 * GET home page.
 */


var config = require('../config');
var conf = new config();

console.log("NODE_ENV: " + process.env.NODE_ENV);





exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.partials = function(req, res){
  res.render('partials/' + req.params.name);
};