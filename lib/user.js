var redis = require('redis');
var bcrypt = require('bcrypt');
var db = redis.createClient();

function User(obj){
  for (var key in obj){
    this[key] = obj[key];
  }
}

User.prototype.save = function(fn){
  if(this.id){
    this.update(fn)
  } else {
    var user = this;
    db.incr('user:ids', function(err, id){
      if(err) fn(err);

      user.id = id;
      user.hashPassword(function(err){
        if(err) fn(err);

        user.update(fn);
      });
    });
  }
};

User.prototype.update = function(fn){
  var user = this;
  var id = user.id;
  db.set('user:id:'+user.name, id, function(err){
    if(err) fn(err);

    db.hmset('user:'+id, user, function(err){
      fn(err);
    });
  });
};

User.prototype.hashPassword = function(fn){
  var user = this;
  bcrypt.genSalt(12, function(err, salt){
    if(err) fn(err);

    user.salt = salt;
    bcrypt.hash(user.pass, salt, function(err, hash){
      if(err) fn(err);

      user.pass = hash;
      fn();
    })
  });
}

module.exports = User;