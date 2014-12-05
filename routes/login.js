var User = require('../lib/user');

exports.form = function(req, res){
	res.render('login', {title: 'Login'});
};

exports.submit = function(req, res, next){
	var username = req.body.user.name;
	var pass = req.body.user.pass;

	User.authenticate(username, pass, function(err, user){
		if(err) return next(err);

		if(user){
			req.session.uid = user.id;
			res.redirect('/');
		} else {
			res.error('Invalid user credentials!');
			res.redirect('back');
		}
	});
};

exports.logout = function(req, res){

};