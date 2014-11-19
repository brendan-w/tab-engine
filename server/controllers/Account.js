
var models = require('../models');

var Account = models.Account;

module.exports.homePage = function(req, res)
{
    var viewData = {
        logged_in: req.session.account !== undefined
    };
    res.render('home', viewData);
};

module.exports.loginPage = function(req, res)
{
    res.render('login');
};

module.exports.signupPage = function(req, res)
{
    res.render('signup');
};

module.exports.accountPage = function(req, res)
{
    res.render('account');
};

module.exports.logout = function(req, res)
{
    req.session.destroy();
    res.redirect('/');
};

module.exports.login = function(req, res)
{

    var username = req.body.username;
    var password = req.body.password;

    if(!username || !password)
    {
        return res.status(400).json({error: "RAWR! All fields are required"});
    }

    Account.AccountModel.authenticate(username, password, function(err, account)
    {
        if(err || !account)
        {
            return res.status(401).json({error: "Wrong username or password"});
        }
        
        req.session.account = account.toAPI();
        
        res.json({redirect: '/account'});
    });

};

module.exports.signup = function(req, res)
{

    var username = req.body.username;
    var password1 = req.body.password1;
    var password2 = req.body.password2;


    if(!username || !password1 || !password2)
    {
        return res.status(400).json({error: "RAWR! All fields are required"});
    }

    if(password1 !== password2)
    {
        return res.status(400).json({error: "RAWR! Passwords do not match"});
    }
	
	Account.AccountModel.generateHash(password1, function(salt, hash)
    {

		var accountData = {
			username: username,
			salt: salt,
			password: hash
		};
		
		var newAccount = new Account.AccountModel(accountData);
		
		newAccount.save(function(err)
        {
			if(err)
            {
				console.log(err);
				return res.status(400).json({error:'An error occurred'}); 
			}

            req.session.account = newAccount.toAPI();
            
			res.json({redirect: '/account'});
		});
	});
};
