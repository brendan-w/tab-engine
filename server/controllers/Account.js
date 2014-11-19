
var models = require('../models');

var Account = models.Account;

module.exports.homePage = function(req, res)
{
    res.render('home');
};

module.exports.loginPage = function(req, res)
{
    res.render('login');
};

module.exports.signupPage = function(req, res)
{
    res.render('signup');
};

module.exports.logout = function(req, res)
{
    req.session.destroy();
    res.redirect('/');
};

module.exports.login = function(req, res)
{

    var username = req.body.username;
    var password = req.body.pass;

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
        
        res.json({redirect: '/maker'});
    });

};

module.exports.signup = function(req, res)
{

    if(!req.body.username || !req.body.pass || !req.body.pass2)
    {
        return res.status(400).json({error: "RAWR! All fields are required"});
    }

    if(req.body.pass !== req.body.pass2)
    {
        return res.status(400).json({error: "RAWR! Passwords do not match"});
    }
	
	Account.AccountModel.generateHash(req.body.pass, function(salt, hash)
    {

		var accountData = {
			username: req.body.username,
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
            
			res.json({redirect: '/maker'});
		});
	});
};
