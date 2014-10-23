
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
var digitTest = /[0-9]/;                  //check whether a digit is a character
var stringTest = /(.*\|-.*)|(.*-\|.*)/;   //check whether a string represents a guitar string (in tab form)
var sectionDivider = /\n\s*\n/;           //splitter for each row of tabs in the document
var songTest = /name|song/i;              //keys found near the song name
var artistTest = /artist|band|group|by/i; //keys found near the artist's name
var tuningTest = /tuning/i;               //keys found near the tuning definition
var maxFret = 36;                         //sanity check (only used when there are no seperators between fret numbers)
var maxFretDigits = maxFret.toString().length;
var keyTests = [
	/C/i,
	/C#|Db/i,
	/D/i,
	/D#|Eb/i,
	/E/i,
	/F/i,
	/F#|Gb/i,
	/G/i,
	/G#|Ab/i,
	/A/i,
	/A#|Bb/i,
	/B/i,
];


function parse(tab_text, user_data)
{
	//extract metadata
	
	//parse the tab

	var sections = textToSections(tab_text);

	sections.forEach(function(strings) {
		var numStrings = strings.length;

		if(numStrings > 0)
		{
			var columns = stringsToColumns(strings);
			var frames = columnsToFrames(columns, numStrings);
			console.log(frames);
		}
	});

	var sig = "";
}

//creates an array of sections (a section is an array of "strings" representing the guitar |-------strings-------|)
function textToSections(text)
{
	lines = text.split(/\n/);
	sections = []; //list of sections (section = arrays of lines)
	current = []; //line accumulator

	lines.forEach(function(line) {
		if(stringTest.test(line))
		{
			//this line represents a string
			current.push(line);
		}
		else if(current.length > 0)
		{
			//this line ISN'T a string, so push the current buffer and wait for a new section of strings
			sections.push(current);
			current = [];
		}
	});
	
	return sections;
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
		current = [];
		for(var s = 0; s < numStrings; s++)
			current[s] = "";
	}

	//pushes the current frame onto the frame list, checks
	function commit()
	{
		frames.push(current);
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

	//compares the given column and the current column to determine if the current frame should be committed (looks at incoming numbers vs seperators)
	function isBreakPoint(column)
	{
		//quick test for empty current frame (skip white space, still waiting for numbers to accumulate)
		if(current.join('').length === 0)
			return false;

		for(var s = 0; s < numStrings; s++)
		{
			var digitIncoming = digitTest.test(column[s]); //check whether the next char for this string is a digit

			//guard for strings of digits "1214121412"
			//if maximum number of digits has been achieved, and more digits are incoming, then break the frame NOW
			if((current[s].length === maxFretDigits) && digitIncoming)
				return true;

			//guard for strings of zeros "00000"
			//if a zero was collected, and digits are still incomming, break now (no one write "01--02--03 etc... they write 1--2--3 ")
			if((current[s] === "0") && digitIncoming)
				return true;

			//normal splitter, for digits vs. seperators (non-digits)
			//if digits have been accumulated, and digits are still incoming, then this is NOT a breakpoint
			if((current[s] !== "") && digitIncoming)
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
