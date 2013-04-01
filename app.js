
/**
 * Module dependencies.
 */



var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , bcrypt = require('bcrypt')
  , log = require('./routes/log')
  , path = require('path');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
  done(null, user.username);
});

passport.deserializeUser(function(username, done){
  db.collection('users').findOne({username: username}, function(err, user){
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done){
    db.collection('users').findOne({username: username}, function(err, doc){
      console.log(err);
      console.log(doc);
      if(doc === null){
        console.log("No such user " + username);
        return done(null, false, {message: 'Incorrect username'});
      }
      else{
        bcrypt.compare(password, doc.password, function(err, isMatch){
          if(err){
            console.log(err);
          }
          else {
            console.log(isMatch);
            if(isMatch){
              return done(null, doc);
            }
            else {
              return done(null, false, { message: 'Incorrect password.'})
            }
          }
        });
      }



    });
  }
));

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ cookie: { maxAge: 30*24*60*60*1000 }}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next){
    res.locals.user = req.session.passport.user;
    next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

//app.post('/login', routes.login);

app.get('/users', user.list);
app.get('/partials/:name', routes.partials);

app.post('/register', user.register);
app.post('/login', passport.authenticate('local'), function(req, res){
  console.log(JSON.stringify(req.user) +" logged in");
  res.send({username: req.user.username, isAdmin: req.user.isAdmin});
});
app.get('/logout', function(req, res){
  req.logout();
  res.send("");
})

app.get('/log', log.socket);



/*app.get('/api/:collection', api.query);
app.get('/api/:collection/:id', api.read);
app.post('/api/:collection', requireAdmin,api.save);
app.del('/api/:collection/:id', api.delete);
app.put('/api/:collection/group', api.group);
app.put('/api/:collection/mapReduce', api.mapReduce);

app.put('/api/:collection/:cmd', api.command);*/

app.get('/getSession', function(req, res){
  if(req.isAuthenticated()){
    res.send({username: req.user.username, isAdmin: req.user.isAdmin});
  }
  else {
    res.send(null);
  }
})

var db = require('mongojs').connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/BGL");
console.log("MONGOLAB_URI: " + process.env.MONGOLAB_URI);
function ensureAdmin(req, res, next){
  if(req.isAdmin()){return next();}
}

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()) { return next(); }
  res.send("");
}

function requireAdmin(req, res, next){
  console.log(JSON.stringify(req.user));
  if(req.isAuthenticated && req.user.isAdmin === true){
    next();
  }
  else {
    res.send(403);
  }
}

helpers = function(req, res){
  var map = {};
  res.isAuthenticated = req.isAuthenticated();
  res.isAdmin = req.isAdmin();
  res.user.isAdmin = req.user.isAdmin;
  res.user = req.user;
  next();
}

server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server)
  , childProcess = require('child_process')
  , minecraftServer = null;

io.sockets.on('connection', function(socket){
  socket.on('startServer', function(){
    minecraftServer = childProcess.spawn(
      "java",
      ['-Xms1024M', '-Xmx1G', '-jar', 'ftbserver.jar', 'nogui'],
      {cwd: process.env.MINECRAFT_DIR || '/home/mlieberman/Downloads/ftb'}
    );
    io.sockets.emit('status', "Starting Server");
    minecraftServer.stdout.on('data', function(data){
      if(data){
        io.sockets.emit('console', ""+data);
      }
    });
    minecraftServer.stderr.on('data', function(data){
      if(data){
        io.sockets.emit('console', ""+data);
      }
    });
    minecraftServer.on('exit', function(){
      minecraftserver = null;
      io.sockets.emit('status', "Shutdown Server");
    })
  });
});