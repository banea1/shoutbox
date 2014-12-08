var Entry = require('../lib/entry');

exports.list = function(req, res, next){
  Entry.getRange(0, -1, function(err, entries){
    if(err) return next(err);

    res.render('entries', {
      title: 'Entries',
      entries: entries
    });
  });
};

exports.form = function(req, res){
  res.render('post', {title: 'Post'});
};

exports.submit = function(res, res, next){

};