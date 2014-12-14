
module.exports.stringTest     = /(.*\|-.*)|(.*-\|.*)/;     //check whether a string represents a guitar string (in tab form)
module.exports.songTest       = /name|song/i;              //keys found near the song name
module.exports.artistTest     = /artist|band|group|by/i;   //keys found near the artist's name
module.exports.digitTest      = /[0-9]/;                   //check whether a digit is a character
module.exports.minTabStrings  = 3;                         //minimum number of string to be considered valid (helps eliminate dividers)
module.exports.maxFret        = 36;                        //sanity check (only used when there are no seperators between fret numbers)
module.exports.maxFretDigits  = module.exports.maxFret.toString().length;

module.exports.linePrefixTest = /\s*[abcdefg#]+.*-/i;
module.exports.keyTests       = [
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

//tunings are stored from highest freq to lowest
module.exports.tuning = {
//                       high                 low
	'Standard':          [4,  11, 7,  2,  9,  4 ],
	'Drop D':            [4,  11, 7,  2,  9,  2 ],
	'Double Drop D':     [2,  11, 7,  2,  9,  2 ],
	'D Modal Tuning':    [2,  9,  7,  2,  9,  2 ],
	'Dropped C':         [2,  9,  5,  0,  7,  0 ],
	'Dropped B':         [1,  8,  4,  11, 6,  11],
	'Dropped A':         [9,  6,  2,  9,  4,  9 ],
	'A Tuning':          [9,  4,  0,  7,  2,  9 ],
	'Eb Tuning':         [3,  10, 6,  1,  8,  3 ],
	'D Tuning':          [2,  9,  5,  0,  7,  2 ],
	'Db Tuning':         [3,  10, 6,  1,  8,  1 ],
	'C Tuning':          [0,  7,  3,  10, 5,  0 ],
	'B Standard Tuning': [11, 6,  2,  9,  4,  11],
	'Bb Tuning':         [3,  10, 6,  1,  8,  3 ],
	'G Tuning':          [3,  10, 6,  1,  8,  3 ],
	'Open A Tuning':     [4,  1,  9,  4,  9,  4 ],
	'Open C Tuning':     [4,  0,  7,  0,  7,  0 ],
	'Open D Tuning':     [2,  9,  6,  2,  9,  2 ],
	'Open Db Tuning':    [1,  8,  5,  1,  8,  1 ],
	'Open E Tuning':     [4,  11, 8,  4,  11, 4 ],
	'Open F Tuning':     [5,  0,  5,  0,  9,  5 ],
	'Open G Tuning':     [2,  11, 7,  2,  7,  2 ],
};

module.exports.scales = {

};




