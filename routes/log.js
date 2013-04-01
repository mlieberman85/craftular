/**
 * Created with JetBrains WebStorm.
 * User: mlieberman
 * Date: 4/2/13
 * Time: 10:52 AM
 * To change this template use File | Settings | File Templates.
 */

//var db = require('mongojs').connect('BGL');
/*var db = require('mongojs').connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/BGL");




var objectId = function (_id) {
  if (_id.length === 24 && parseInt(db.ObjectId(_id).getTimestamp().toISOString().slice(0,4), 10) >= 2010) {
    return db.ObjectId(_id);
  }
  return _id;
}

var mongoCallback = function (req, res) {
  res.contentType('application/json');
  var mongoCallback = function (err, doc) {
    if (err) {
      if (err.message) {
        doc = {error : err.message}
      } else {
        doc = {error : JSON.stringify(err)}
      }
    }
    if (typeof doc === "number" || req.params.cmd === "distinct") { doc = {ok : doc}; }
    res.send(doc);
  };
  return mongoCallback;
};



exports.query = function(req, res) {
  var item, sort = {}, qw = {};
  for (item in req.query) {
    req.query[item] = (typeof +req.query[item] === 'number' && isFinite(req.query[item]))
      ? parseFloat(req.query[item],10)
      : req.query[item];
    if (item != 'limit' && item != 'skip' && item != 'sort' && item != 'order' && req.query[item] != "undefined" && req.query[item]) {
      qw[item] = req.query[item];
    }
  }
  if (req.query.sort) { sort[req.query.sort] = (req.query.order === 'desc' || req.query.order === -1) ? -1 : 1; }
  db.collection(req.params.collection).find(qw).sort(sort).skip(req.query.skip).limit(req.query.limit).toArray(mongoCallback(req, res))
};

exports.read = function(req, res){
  db.collection(req.params.collection).findOne({_id:objectId(req.params.id)}, mongoCallback(req, res));
};

exports.save = function(req, res){
  if (req.body._id) {
    req.body._id = objectId(req.body._id);
  }
  db.collection(req.params.collection).save(req.body, {safe:true}, mongoCallback(req, res));
};

exports.delete = function(req, res) {
  db.collection(req.params.collection).remove({_id:objectId(req.params.id)}, {safe:true}, mongoCallback(req, res));
};

exports.group = function(req, res){
  db.collection(req.params.collection).group(req.body, mongoCallback(req, res));
};

exports.mapReduce = function(req, res) {
  if (!req.body.options) {req.body.options  = {}};
  req.body.options.out = { inline : 1};
  req.body.options.verbose = false;
  db.collection(req.params.collection).mapReduce(req.body.map, req.body.reduce, req.body.options, mongoCallback(req, res));
};

exports.command = function (req, res) {
  if (req.params.cmd === 'distinct') {req.body = req.body.key}
  db.collection(req.params.collection)[req.params.cmd](req.body, mongoCallback(req, res));
};*/




var io = require('socket.io'),
  Tail = require('tail').Tail;



var socket = io.listen(2001);
tail = new Tail("/home/mlieberman/ftb/server.log");
socket.sockets.on('connection', function(client){

  client.send({file: "/home/mlieberman/ftb/server.log"});
  tail.on("line", function(data){
    console.log(data);
    client.emit('tail', data);
    //client.send("BLAH!!!");
  })
});








/*var socket = io.listen(2001);
socket.on('connection', function(client){
  client.send({file: file});
  fs.stat(file, function(err, stats){
    if(err) {
      //error handling to go here
    }
    var start = (stats.size > backlog_size)?(stats.size - backlog_size):0;
    var stream = fs.createReadStream(file, {start: start, end: stats.size})
      stream.addListener("data", function(lines){
        lines = lines.toString("utf-8");
        lines = lines.slice(lines.indexOf("\n")+1).split("\n");
        client.send({tail: lines});
      });
  });
});

fs.watchFile(file, function(curr, prev){
  if(prev.size > curr.size) {
    return {clear: true};
  }
  var stream = fs.createReadStream(file, {start: prev.size, end: curr.size});
  stream.addListener("data", function(lines){
    socket.broadcast({tail: lines.toString('utf-8').split("\n")});
  });
});*/

exports.socket = function(req, res){
  res.render("log");
}