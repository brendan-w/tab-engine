
var c = require('./controllers');
var m = require('./middleware.js');

var router = function(app) {

	app.get ("/",           m.https,               c.Account.homePage);
	app.get ("/login",      m.https, m.logged_out, c.Account.loginPage); 
	app.post("/login",      m.https, m.logged_out, c.Account.login);
	app.get ("/signup",     m.https, m.logged_out, c.Account.signupPage);
	app.post("/signup",     m.https, m.logged_out, c.Account.signup);
	app.get ("/logout",              m.logged_in,  c.Account.logout);
	app.get ("/account",             m.logged_in,  c.Account.accountPage);
	app.get ("/upload",              m.logged_in,  c.Tab.uploadPage);
	app.post("/upload",              m.logged_in,  c.Tab.upload);
	app.get ("/tab/:tabid",                        c.Tab.tabPage);

};

module.exports = router;
