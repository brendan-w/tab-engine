
var request = require("request");



module.exports.beautify = function(tab) {
	
	tab = tab.replace(/-\|\|-/g, '─┼┼─');

	tab = tab.replace(/-\|-/g,   '─┼─');

	tab = tab.replace(/-\|\|/g, '─┼┤');
	tab = tab.replace(/\|\|-/g, '├┼─');

	tab = tab.replace(/-\|/g, '─┤');
	tab = tab.replace(/\|-/g, '├─');
	tab = tab.replace(/-/g, '─');

	return tab;
};


module.exports.importURL = function(url, callback) {
	request({ uri: url }, function(error, response, body) {

		var output = {
			tab:"",
			song:"",
			artist:"",
		};

		//start extracting data from the page
		//I know, this is ugly... no time to fight with regex

		//song name
		var key = "<div class=\"t_title";
		var loc = body.indexOf(key) + key.length;
		var song = body.substr(loc);

		key = "<h1>";
		loc = song.indexOf(key) + key.length;
		song = song.substr(loc);

		var eloc = song.indexOf("</h1>");
		output.song = song.substr(0, eloc);


		//artist
		key = "<div class=\"t_autor\">by";
		loc = body.indexOf(key) + key.length;
		var artist = body.substr(loc);

		key = "\">";
		loc = artist.indexOf(key) + key.length;
		artist = artist.substr(loc);

		key = "</a>";
		eloc = artist.indexOf(key);
		output.artist = artist.substr(0, eloc);


		//the tab itself
		key = "                                        <pre><i></i>";
		loc = body.indexOf(key) + key.length;
		var tab = body.substr(loc);

		eloc = tab.indexOf("</pre>");
		output.tab = tab.substr(0, eloc);


		//done
		callback(null, output);
	});
};

