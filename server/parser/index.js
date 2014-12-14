

var frame = require("./framer.js");
var matrix = require("./matrix.js");
var config = require("./config.js");





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
	var tuning = tuningFromMeta(parts.meta) || config.tuning.standard;
	var frames = frame(parts.tabs, tuning);
	//var m = matrix(frames);

	var totals = [0,0,0,0,0,0,0,0,0,0,0,0];
	for(var i = 0; i < frames.length; i++)
	{
		for(var n = 0; n < frames[i].length; n++)
		{
			totals[frames[i][n]]++;
		}
	}

	var sum = totals.reduce(function(a, b) { return a + b });
	var avg = sum / totals.length;
	console.log(totals);
	console.log(avg);

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
