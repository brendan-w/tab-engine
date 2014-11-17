
//includes all the .JS files in this directory

var fs   = require('fs');
var path = require('path');

var this_file = path.basename(__filename);

fs.readdirSync(__dirname).forEach(function(f) {
	var ext  = path.extname(f);
	var name = path.basename(f, ext);

	if((ext === '.js') && (f !== this_file))
		module.exports[name] = require("./" + f);
});
