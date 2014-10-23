
//regex
var digitChars = /[0-9]/;
var stringChars = /[-─]/;
var sectionDividers = /\n\s*\n/;


function parse(tab)
{
	sections = tabToSections(tab);

	sections.forEach(function(section) {
		var strings = sectionToStrings(section);
		var numStrings = strings.length;
		var columns = stringsToColumns(strings);
		var frames = columnsToFrames(columns, numStrings);
	});

}

function tabToSections(tab)
{
	return tab.split(sectionDividers);
}

//creates an array of "strings" representing the guitar |-------strings-------| 
function sectionToStrings(section)
{
	var lines = section.split(/\n/);
	var strings = [];

	//filter for only lines with line chars
	lines.forEach(function(line) {
		if(stringChars.test(line))
			strings.push(line);
	});

	return strings;
}

//transposes an array of horizontal strings into an array of vertical arrays, each element being a single char
function stringsToColumns(strings)
{
	var columns = [];
	for(var c = 0; c < smallest(strings, 'length'); c++)
	{
		var column = [];
		//loop through each string, and fill the column with chars
		for(var s = 0; s < string.length; s++)
		{
			column[s] = strings[s][c];
		}
		columns.push(column);
	}

	return columns;
}


function columnsToFrames(columns, numStrings)
{
	var frames = [];
	var current = []; //accumulates "strings" of fret numbers, where [i] = |---string---| number

	function reset()
	{
		for(int s = 0; s < numStrings; s++)
			current[s] = "";
	}

	//pushes an integer version of the current frame onto the frame list
	function commit()
	{
		var newFrame = [];
		current.forEach(function(v, s) {
			newFrame[s] = 0;
			if(v !== "")
				newFrame[s] = parseInt(current[s]);
		});
		frames.push(newFrame);
		reset();
	}

	//appends the given columns digit chars to those in the current frame
	function add(column)
	{
		for(int s = 0; s < numStrings; s++)
		{
			var ch = column[s]; //char
			if(digitChars.test(ch))
				current[s] += ch;
		}
	}

	//compares the given column and the current column to determine if the current frame should be committed
	function isBreakPoint(column)
	{
		return true;
	}

	//main loop
	reset();
	columns.forEach(function(column, c) {
		if(isBreakPoint(column))
			commit(); //commit what has accumulated in the current frame
		add(column);
	});
}

function smallest(array, prop)
{
	var min = array[0][prop];
	array.forEach(function(v) {
		if(v[prop] < min)
			min = v[prop];
	});
	return min;
}
