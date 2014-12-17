

var framer   = require("./framer.js");
var matrixer = require("./matrixer.js");
var scaler   = require("./scaler.js");
var config   = require("./config.js");





//main function
/*
	accepts an object containing all properties found in the Tab model
	parses for undefined data

	{
		tab: <the raw tab text>
		name: <song name>
		artist: <artist name>
	}
*/
module.exports = function(tab_props) {

	var parts = split(tab_props.tab);

	//parse the meta data
	var tuning = tuningFromMeta(parts.meta) || config.tuning['Standard'];
	var frames = framer(parts.tabs, tuning);
	var key    = findKey(frames);
	var matrix = matrixer(frames);
	var scale  = scaler(matrix, key);

	tab_props.key = config.keys[key]; //lookup the string name for this key
	tab_props.scale = scale;
	

	return tab_props;
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

function findKey(frames)
{
	//init array of zeros for each note
	var notes = Array.apply(null, new Array(12)).map(Number.prototype.valueOf, 0);

	for(var i = 0; i < frames.length; i++)
		for(var n = 0; n < frames[i].length; n++)
			notes[frames[i][n]]++;

	var max = Math.max.apply(Math, notes);
	return notes.indexOf(max);
}
