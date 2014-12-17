
var models = require('../models');

//models
var Account = models.Account;
var Tab     = models.Tab;



module.exports.homePage = function(req, res) {
	res.render('index', {
		logged_in: req.session.account !== undefined
	});
};

module.exports.loginPage = function(req, res) {
	res.render('login');
};

module.exports.signupPage = function(req, res) {
	res.render('signup');
};

module.exports.accountPage = function(req, res) {
	
	Tab.TabModel.findByOwner(req.session.account._id, function(err, docs) {

		if(err)
		{
			console.log(err);
			return res.status(400).json({error:'An error occurred'});
		}

		res.render('account', {
			username: req.session.account.username,
			tabs: docs,
		});
	});

};

module.exports.logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};

module.exports.login = function(req, res) {
	var username = req.body.username + ""; //cast to string
	var password = req.body.password + "";

	if(!username || !password)
	{
		return res.status(400).json({error: "All fields are required"});
	}

	Account.AccountModel.authenticate(username, password, function(err, account)
	{
		if(err || !account)
		{
			return res.status(401).json({error: "Wrong username or password"});
		}
		
		req.session.account = account;
		res.json({redirect: '/account'});
	});
};

module.exports.signup = function(req, res) {

	var username  = req.body.username;
	var password1 = req.body.password1;
	var password2 = req.body.password2;


	if(!username || !password1 || !password2)
	{
		return res.status(400).json({error: "All fields are required"});
	}

	if(password1 !== password2)
	{
		return res.status(400).json({error: "Passwords do not match"});
	}
	
	Account.AccountModel.generateHash(password1, function(salt, hash) {
		
		var newAccount = new Account.AccountModel({
			username: username,
			salt: salt,
			password: hash
		});
		
		newAccount.save(function(err) {
			if(err)
			{
				console.log(err);
				return res.status(400).json({error:'An error occurred'}); 
			}

			req.session.account = newAccount;
			res.json({redirect: '/account'});
		});
	});
};
