
var fs = require("fs");
var parse = require("./parser.js");

tab1 = fs.readFileSync("./tests/eruption2.tab", "utf8");
tab2 = fs.readFileSync("./tests/eruption.tab", "utf8");

m1 = parse(tab1, {});
m2 = parse(tab2, {});

m1.compare(m2);
