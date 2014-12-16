
var fs = require("fs");
var parse = require("./index.js");



tab = fs.readFileSync("./tests/sweet_child_o_mine.tab", "utf8");


parse({
	tab: tab,
	name: "",
	artist: "",
});
