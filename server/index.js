//entry point

var url             = require('url');
var path            = require('path');
var body_parser     = require('body-parser');
var compression     = require('compression');
var serve_favicon   = require('serve-favicon');
var cookie_parser   = require('cookie-parser');
var express         = require('express');
var express_session = require('express-session');
var mongoose        = require('mongoose');
var RedisStore      = require('connect-redis')(express_session);

var config          = require("./config.js");
var router          = require('./router.js');


//console.log(config);
function handleError(err) { if(err) console.log(err); }


var mongodb = mongoose.connect(config.mongo_url, handleError);

var app = express();
app.use('/static', express.static(config.static_dir)); 
app.set('views', config.views_dir); 
app.set('view engine', 'jade'); 
app.use(compression());
app.use(body_parser.urlencoded({ extended: true }));
app.use(serve_favicon(config.favicon)); 
app.use(cookie_parser()); 
app.use(express_session({
    store: new RedisStore(config.redis_url_obj),
    secret: 'why is the cosmos expanding', //the biggest secret
    resave: true,
    saveUninitialized: true,
}));

router(app);

var server = app.listen(config.http_port, handleError);

console.log("Done");
