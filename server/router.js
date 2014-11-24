
var c = require('./controllers');
var m = require('./middleware.js');

var router = function(app) {

	app.get ("/",           m.https,               c.account.homePage);
	app.get ("/login",      m.https, m.logged_out, c.account.loginPage); 
	app.post("/login",      m.https, m.logged_out, c.account.login);
	app.get ("/signup",     m.https, m.logged_out, c.account.signupPage);
	app.post("/signup",     m.https, m.logged_out, c.account.signup);
	app.get ("/logout",              m.logged_in,  c.account.logout);
	app.get ("/account",             m.logged_in,  c.account.accountPage);
	app.get ("/upload",              m.logged_in,  c.tab.uploadPage);
	app.post("/upload",              m.logged_in,  c.tab.upload);
	app.get ("/tab/:tabid",                        c.tab.tabPage);

};

module.exports = router;
