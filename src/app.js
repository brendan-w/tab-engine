
var fs = require("fs");
var parse = require("./parse.js");


tab1 = "";
tab2 = "";

fs.readFile("./tests/eruption.tab", "utf8", function(err, tab) {
	if(err)
	{
		console.log(err);
	}
	else
	{
		tab1 = tab;
		fs.readFile("./tests/technical_difficulties.tab", "utf8", function(err, tab) {
			if(err)
			{
				console.log(err);
			}
			else
			{
				tab2 = tab;
				m1 = parse(tab1, {});
				console.log("=================");
				m2 = parse(tab2, {});
			}
		});
	}
});

