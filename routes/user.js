
/*
 * GET users listing.
 */

var db = require('mongojs').connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/BGL")
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.register = function(req, res){
  if(req.body.password !== req.body.password2){
    //req.flash('error', "Passwords do not match");
    //res.redirect('/register');
  }
  else {
    db.collection('users').findOne({username: req.body.username}, function(err, doc){
      console.log(err);
      console.log(doc);
      if(doc !== null){
        //req.flash('error', 'Username already exists');
        //res.redirect('/register');
      }
      else{
        db.collection('users').findOne({email: req.body.email}, function(err, doc){
          console.log(err);
          console.log(doc);
          if(doc !== null){
            //req.flash('error', 'Email has already been registered');
          }
          else {
            console.log(req.query);
            console.log("Registering: " + req.param('firstName') + " " + req.param("lastName") + " with username: " +
              req.param("username"));
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
              if(err) {
                return next(err);
              }
              bcrypt.hash(req.param('password'), salt, function(err, hash){
                if(err){
                  return next(err);
                }
                var password = hash;
                var newUser = db.collection('users').save({
                  firstName: req.param('firstName'),
                  lastName: req.param('lastName'),
                  email: req.param('email'),
                  username: req.param('username'),
                  password: password,
                  isAdmin: false
                });
                res.send({type:"success", message: "Registering Successful"})
              });
            });

          }
        });
      }
    });
  }
}

