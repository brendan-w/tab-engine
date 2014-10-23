
/*

Parsing engine for generating searchable progression signitures


A tab signiture is derived from an interval matrix like such:
	where x axis = any given note in the tab  (n)
	and y axis   = the next note in the tab   (n+1)
	and the value at (x,y) is the number of times this interval occured


    A A# B C C# D D# E F F# G G# 
    ____________________________
A  |     1
A# |                     8
B  |         15             4  5
C  |
C# |     6
D  |  3           2  7
D# |
E  |                  4
F  |            1
F# |            9
G  |
G# |


The matrix is then normalized [0-255] and rendered in row-major hex, and should look something like this (288 chars of hex):

D000900D0000000ACC007FAE74747950FA700200004100CB440EEB007C190000B93C667900CD0737003900B93C00000000D9CFB200BA00DCC50000E2005C00009E7ABE008C0096070045D300FE06FD7500EE5B0000E65999009FCC0000004C9DFA1FCDD64F75F6C2A21CACE3FE006922004322C84E0000D1DE005C3ACF4100000000AE0061A5BDB0CE9CA500DF390000

*/


//regex
var digitTest = /[0-9]/;
var stringTest = /(.*\|-.*)|(.*-\|.*)/;
var sectionDivider = /\n\s*\n/;
var songTest = /name|song/i;
var artistTest = /artist|band|group|by/i;
var tuningTest = /tuning/i;


function parse(tab_text, user_data)
{
	sections = textToSections(tab_text);

	var sig = "";

	sections.forEach(function(section) {
		var strings = sectionToStrings(section);
		var numStrings = strings.length;

		if(numStrings > 0)
		{
			var columns = stringsToColumns(strings);
			var frames = columnsToFrames(columns, numStrings);
			console.log(frames);
		}
	});

}

function textToSections(text)
{
	return text.split(sectionDivider);
}

//creates an array of "strings" representing the guitar |-------strings-------| 
function sectionToStrings(section)
{
	var lines = section.split(/\n/);
	var strings = [];

	//filter for only lines with line chars
	lines.forEach(function(line) {
		if(stringTest.test(line))
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
		for(var s = 0; s < strings.length; s++)
		{
			column[s] = strings[s][c];
		}
		columns.push(column);
	}

	return columns;
}

//concatinates char columns into frames (one for every note change), with integer fret numbers
function columnsToFrames(columns, numStrings)
{
	var frames = [];
	var current = []; //accumulates "strings" of fret numbers, where [i] = |---string---| number

	function reset()
	{
		for(var s = 0; s < numStrings; s++)
			current[s] = "";
	}

	//pushes an integer version of the current frame onto the frame list
	function commit()
	{
		var newFrame = [];
		current.forEach(function(v, s) {
			newFrame[s] = -1;
			if(v !== "")
				newFrame[s] = parseInt(current[s]);
		});
		frames.push(newFrame);
		reset();
	}

	//appends the given columns digit chars to those in the current frame
	function add(column)
	{
		for(var s = 0; s < numStrings; s++)
		{
			var ch = column[s]; //char
			if(digitTest.test(ch))
				current[s] += ch;
		}
	}

	//compares the given column and the current column to determine if the current frame should be committed
	function isBreakPoint(column)
	{
		//quick test for empty current frame (frequent case)
		if(current.join('').length === 0)
			return false;

		for(var s = 0; s < numStrings; s++)
		{
			//if digits have been accumulated, and digits are still incoming, then this is NOT a breakpoint
			if((current[s] !== "") && digitTest.test(column))
				return false;
		}
		return true;
	}

	//main loop
	reset();
	columns.forEach(function(column, c) {
		if(isBreakPoint(column))
			commit(); //commit what has accumulated in the current frame
		add(column);
	});

	return frames;
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

module.exports = parse;
