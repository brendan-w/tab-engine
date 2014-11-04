
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
	//            e  B   G  D  A  E
	"standard" : [4, 11, 7, 2, 9, 4],

	
};

