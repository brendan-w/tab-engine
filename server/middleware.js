
var config = require("./config.js");



module.exports.noop = function(req, res, next) { next(); }

module.exports.logged_in = function(req, res, next)
{
	if(!req.session.account)
		return res.redirect('/');
	next();
}

module.exports.logged_out = function(req, res, next)
{
	if(req.session.account)
		return res.redirect('/maker');   
	next();
}

module.exports.https = function(req, res, next)
{
	if(req.headers['x-forwarded-proto'] != 'https')
		return res.redirect('https://' + req.hostname + req.url);
	next();
}

if(config.skipHTTPS)
{
	module.exports.https = module.exports.noop;
}