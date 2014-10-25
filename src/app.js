
var fs = require("fs");
var parse = require("./parse.js");

//var file = "./tests/test.tab";
//var file = "./tests/technical_difficulties.tab";
var file = "./tests/eruption.tab";

fs.readFile(file, "utf8", function(err, tab) {
	if(err)
		console.log(err);
	else
		parse(tab, {});
});

