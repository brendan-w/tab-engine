
var url  = require('url');
var path = require('path');



/*
	Helpers and whatnot
*/

var REDISLOCAL_URL = {
	host: "localhost",
	port: 6379,
	pass: undefined
};

function REDISCLOUD_URL()
{
	if(process.env.REDISCLOUD_URL)
	{
		var parsedURL = url.parse(process.env.REDISCLOUD_URL);
		return {
			host: parsedURL.hostname,
			port: parsedURL.port,
			pass: parsedURL.auth.split(":")[1]
		};
	}
	return undefined; //for clearity, nothing more
}




/*
	Environment list
*/
var envs = {
	development: {
		static_dir:    path.resolve(__dirname + "/../static/"),
		views_dir:     path.resolve(__dirname + "/../views/"),
		favicon:       path.resolve(__dirname + "/../static/favicon.png"),
		http_port:     3000,
		http_base_url: "http://localhost:3000",
		redis_url_obj: REDISLOCAL_URL,
		mongo_url:     "mongodb://localhost/TabEngine",
	},

	production: {
		static_dir:    path.resolve(__dirname + "/../static/"),
		views_dir:     path.resolve(__dirname + "/../views/"),
		favicon:       path.resolve(__dirname + "/../static/favicon.png"),
		http_port:     process.env.PORT || process.env.NODE_PORT || 3000,
		http_base_url: "http://appName.herokuapp.com",
		redis_url_obj: REDISCLOUD_URL() || REDISLOCAL_URL,
		mongo_url:     process.env.MONGOHQ_URL || "mongodb://localhost/TabEngine",
	},
};



//determine environment
var default_env = "development";
var env = envs[(process.env.NODE_ENV || default_env)]; //read the environment variable
env = env ? env : default_env;                         //check that the config exists
module.exports = env;                                  //use this during server construction
