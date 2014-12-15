
var fs = require("fs");
var parse = require("./index.js");



tab = fs.readFileSync("./tests/A.tab", "utf8");


parse({
	tab: tab,
	name: "",
	artist: "",
});
