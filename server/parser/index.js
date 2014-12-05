

var frame = require("./framer.js");
var Matrix = require("./Matrix.js");
var config = require("./config.js");





//main function
module.exports = function(text, user_data) {
	var parts = split(text);

	//parse the meta data
	var tuning = tuningFromMeta(parts.meta) || config.tuning.standard;


	var frames = frame(parts.tabs, tuning);
	return new Matrix(frames);
};





//splits the raw tab text into meta and tab sections
function split(text)
{
	meta = [];       //array of meta lines
	tabs = [];       //array of tab sections
	currentTab = []; //line accumulator for tab lines

	function commitCurrent()
	{
		//this line ISN'T a string, so push the current tab buffer and wait for a new section of tab strings
		if(currentTab.length >= config.minTabStrings)
			tabs.push(currentTab);

		currentTab = [];
	}


	lines = text.split(/\n/);

	lines.forEach(function(line) {
		if(config.stringTest.test(line))
		{
			//this line represents a string
			currentTab.push(line);
		}
		else
		{
			//commit the current
			commitCurrent();
			//push the extra data into their own array
			meta.push(line);
		}
	});

	//push whatever's left in the buffer
	commitCurrent();
	
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
