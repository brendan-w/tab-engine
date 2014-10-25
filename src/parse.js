

var frame = require("./frame.js");
var Matrix = require("./Matrix.js");

//constants
var stringTest    = /(.*\|-.*)|(.*-\|.*)/;   //check whether a string represents a guitar string (in tab form)
var songTest      = /name|song/i;            //keys found near the song name
var artistTest    = /artist|band|group|by/i; //keys found near the artist's name
var minTabStrings = 3;                       //minimum number of string to be considered valid





//main function
module.exports = function(text, user_data) {
	var parts = split(text);

	//parse the meta data
	var tuning = tuningFromMeta(parts.meta) || [4, 11, 7, 2, 9, 4];


	var frames = frame(parts.tabs, tuning);
	var matrix = new Matrix(frames);

	console.log(matrix.toHex());
};





//splits the raw tab text into meta and tab sections
function split(text)
{
	meta = [];       //array of meta lines
	tabs = [];       //array of tab sections
	currentTab = []; //line accumulator for tab lines

	lines = text.split(/\n/);

	lines.forEach(function(line) {
		if(stringTest.test(line))
		{
			//this line represents a string
			currentTab.push(line);
		}
		else
		{
			//this line ISN'T a string, so push the current tab buffer and wait for a new section of tab strings
			if(currentTab.length >= minTabStrings)
				tabs.push(currentTab);

			currentTab = [];

			//push the extra data into their own array
			meta.push(line);
		}
	});
	
	return {
		tabs: tabs,
		meta: meta,
	};
}


function tuningFromMeta(text)
{
	var tuning = null;
	/*
	var matches = text.match(/\n.*tuning.*\n/i);

	if(matches !== null)
	{
		var line = matches[0];
		if(!/standard/i.test(line))
		{

		}
	}
	*/
	return tuning;
}
