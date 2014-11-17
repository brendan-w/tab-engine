
var c = require('./controllers');
var m = require('./middleware.js');

var router = function(app) {

    //app.get ("/",       m.https, m.logged_out, c.Account.loginPage);
    //app.get ("/login",  m.https, m.logged_out, c.Account.loginPage); 
    //app.post("/login",  m.https, m.logged_out, c.Account.login); 
    //app.get ("/signup", m.https, m.logged_out, c.Account.signupPage);
    //app.post("/signup", m.https, m.logged_out, c.Account.signup);
    //app.get ("/logout",          m.logged_in,  c.Account.logout);
    //app.get ("/maker",           m.logged_in,  c.Domo.makerPage);
    //app.post("/maker",           m.logged_in,  c.Domo.make);
};

module.exports = router;
