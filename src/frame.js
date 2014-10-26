
/*

Parsing engine for turning raw tabs into integer note sequences
Returns a key-adjusted frame sequence from the tab-text

*/


//regex
var digitTest = /[0-9]/;                  //check whether a digit is a character
var maxFret = 36;                         //sanity check (only used when there are no seperators between fret numbers)
var maxFretDigits = maxFret.toString().length;
var linePrefixTest = /\s*[abcdefg#]+.*-/i;
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


//main function
module.exports = function(tabs, tuning) {
	var noteFrames = [];

	tabs.forEach(function(strings) {
		var numStrings = strings.length;

		if(numStrings > 0)
		{
			//a tuning defined at the string level gets priority
			var localTuning = tuningFromStrings(strings) || tuning;
			var columns = stringsToColumns(strings);
			var frames = columnsToFrames(columns, numStrings);
			adjustFrames(frames, localTuning, noteFrames);
		}
	});

	return noteFrames;
};


function tuningFromStrings(strings)
{
	var tuning = [];

	strings.forEach(function(string) {
		var matches = string.match(linePrefixTest);

		if(matches !== null)
		{
			keyTests.forEach(function(t, i) {
				if(t.test(matches[0])) //assumes
					tuning.push(i); //assumes values are listed from high freq to low freq
			});
		}
	});

	//only valid if every string has a key value
	if(tuning.length !== strings.length)
		tuning = null;
	
	return tuning;
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

//compensate fret values for individual string tuning
function adjustFrames(frames, tuning, noteFrames)
{
	//preprocess the frames by ditching empty strings (no note in frame), and compensating for string tuning
	frames.forEach(function(frame) {
		var notes = [];
		frame.forEach(function(note, s) {
			if(note !== "")
				notes.push((tuning[s] + parseInt(note)) % 12); //octave data is irrelevant here
		});
		noteFrames.push(notes);
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
