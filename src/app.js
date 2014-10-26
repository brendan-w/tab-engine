
var fs = require("fs");
var parse = require("./parse.js");


tab1 = "";
tab2 = "";

//fs.readFile("./tests/eruption2.tab", "utf8", function(err, tab) {
fs.readFile("./tests/A.tab", "utf8", function(err, tab) {
	if(err)
	{
		console.log(err);
	}
	else
	{
		tab1 = tab;
		fs.readFile("./tests/B.tab", "utf8", function(err, tab) {
			if(err)
			{
				console.log(err);
			}
			else
			{
				tab2 = tab;
				m1 = parse(tab1, {});
				m2 = parse(tab2, {});
				m1.compare(m2);
			}
		});
	}
});
