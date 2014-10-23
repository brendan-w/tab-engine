
var fs = require("fs");
var parse = require("./parse.js");

fs.readFile("./tests/technical_difficulties.tab", "utf8", function(err, tab) {
	if(err)
		console.log(err);
	else
		parse(tab, {});
});

