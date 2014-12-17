
var Array2D = require('./Array2D.js');

module.exports.stringTest     = /(.*\|-.*)|(.*-\|.*)/;     //check whether a string represents a guitar string (in tab form)
module.exports.songTest       = /name|song/i;              //keys found near the song name
module.exports.artistTest     = /artist|band|group|by/i;   //keys found near the artist's name
module.exports.digitTest      = /[0-9]/;                   //check whether a digit is a character
module.exports.minTabStrings  = 3;                         //minimum number of string to be considered valid (helps eliminate dividers)
module.exports.maxFret        = 36;                        //sanity check (only used when there are no seperators between fret numbers)
module.exports.maxFretDigits  = module.exports.maxFret.toString().length;

module.exports.linePrefixTest = /\s*[abcdefg#]+.*-/i;
module.exports.keys = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
];

module.exports.keyTests = [
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

//a few helper functions for managing tunings

function equalTuning(t1, t2)
{
	if(t1.length !== t2.length)
		return false;

	for(var i = 0; i < t1.length; i++)
		if(t1[i] !== t2[i])
			return false;

	return true;
}

module.exports.tuningToString = function(t) {
	for(var tuning in module.exports.tuning)
	{
		if(equalTuning(t, module.exports.tuning[tuning]))
			return tuning;
	}

	//unknown tuning, print the notes
	t = t.slice(0); //clone
	for(var i = 0; i < t.length; i++)
		t[i] = module.exports.keys[t[i]];

	return t.join("-");
};

var scales = {
	'Major':                      [0,2,4,5,7,9,11],
	'Harmonic Minor':             [0,2,3,5,7,8,11],
	'Melodic Minor (Ascending)':  [0,2,3,5,7,9,11],
	'Melodic Minor (Descending)': [0,2,3,5,7,8,10],
	'Chromatic':                  [0,1,2,3,4,5,6,7,8,9,10,11],
	'Whole Tone':                 [0,2,4,6,8,10],
	'Pentatonic Major':           [0,2,4,7,9],
	'Pentatonic Minor':           [0,3,5,7,10],
	'Pentatonic Blues':           [0,3,5,6,7,10],
	'Pentatonic Neutral':         [0,2,5,7,10],
	'Ionian':                     [0,2,4,5,7,9,11],
	'Dorian':                     [0,2,3,5,7,9,10],
	'Phrygian':                   [0,1,3,5,7,8,10],
	'Lydian':                     [0,2,4,6,7,9,11],
	'Lydian Augmented':           [0,2,4,6,8,9,11],
	'Lydian Minor':               [0,2,4,6,7,8,10],
	'Lydian Diminished':          [0,2,3,6,7,9,11],
	'Mixolydian':                 [0,2,4,5,7,9,10],
	'Aeolian':                    [0,2,3,5,7,8,10],
	'Locrian':                    [0,1,3,5,6,8,10],
	
	//not using these, because the algorithm is way to shaky to handle this many possibilities
	// (unless you want everything to get classified as something like 'Hirajoshi 2')
	//note to self: program better
	/*
	'Bebop Major':                [0,2,4,5,7,8,9,11],
	'Bebop Minor':                [0,2,3,4,5,7,9,10],
	'Bebop Dominant':             [0,2,4,5,7,9,10,11],
	'Bebop Half Diminished':      [0,1,3,5,6,7,8,11],
	'Blues Variation 1':          [0,3,5,6,7,10,11],
	'Blues Variation 2':          [0,3,4,5,6,7,10,11],
	'Blues Variation 3':          [0,3,4,5,6,7,9,10,11],
	'Mixo-Blues':                 [0,3,4,5,6,7,10],
	'Major Blues Scale':          [0,2,3,4,7,9],
	'Dominant Pentatonic':        [0,2,4,7,10],
	'Chinese 2':                  [0,2,5,7,9],
	'Hirajoshi 2':                [0,4,5,9,11],
	'Iwato':                      [0,1,5,6,10],
	'Kumoi 2':                    [0,1,5,7,8],
	'Pelog 2':                    [0,1,3,7,10],
	'Locrian 6':                  [0,1,3,5,6,9,10],
	'Ionian #5':                  [2,4,5,7,9,11],
	'Dorian #4':                  [2,3,5,7,9,10],
	'Phrygian Major':             [0,1,4,5,7,8,10],
	'Lydian #2':                  [2,4,6,7,9,11],
	'Ultralocrian':               [0,1,3,4,6,8,9],
	'Moorish Phrygian':           [0,1,3,4,5,7,8,10,11],
	'Algerian':                   [0,2,3,5,6,7,8,11],
	'Augmented':                  [0,3,4,6,8,11],
	'Auxiliary Diminished':       [0,2,3,5,6,8,9,11],
	'Auxiliary Augmented':        [0,2,4,6,8,10],
	'Auxiliary Diminished Blues': [0,1,3,4,6,7,9,10],
	'Balinese':                   [0,1,3,7,8],
	'Blues':                      [0,3,5,6,7,10],
	'Byzantine':                  [0,1,4,5,7,8,11],
	'Chinese':                    [0,4,6,7,11],
	'Chinese Mongolian':          [0,2,4,7,9],
	'Diatonic':                   [0,2,4,7,9],
	'Diminished':                 [0,2,3,5,6,8,9,11],
	'Diminished, Half':           [0,1,3,4,6,7,9,10],
	'Diminished, Whole':          [0,2,3,5,6,8,9,11],
	'Diminished Whole Tone':      [0,1,3,4,6,8,10],
	'Dominant 7th':               [0,2,4,5,7,9,10],
	'Double Harmonic':            [0,1,4,5,7,8,11],
	'Egyptian':                   [0,2,5,7,10],
	'Eight Tone Spanish':         [0,1,3,4,5,6,8,10],
	'Enigmatic':                  [0,1,4,6,8,10,11],
	'Hawaiian':                   [0,2,3,5,7,9,11],
	'Hindu':                      [0,2,4,5,7,8,10],
	'Hindustan':                  [0,2,4,5,7,8,10],
	'Hirajoshi':                  [0,2,3,7,8],
	'Hungarian Major':            [0,3,4,6,7,9,10],
	'Hungarian Gypsy':            [0,2,3,6,7,8,11],
	'Hungarian Gypsy Persian':    [0,1,4,5,7,8,11],
	'Hungarian Minor':            [0,2,3,6,7,8,11],
	'Javaneese':                  [0,1,3,5,7,9,10],
	'Kumoi':                      [0,2,3,7,9],
	'Leading Whole Tone':         [0,2,4,6,8,10,11],
	'Major Locrian':              [0,2,4,5,6,8,10],
	'Mohammedan':                 [0,2,3,5,7,8,11],
	'Neopolitan':                 [0,1,3,5,7,8,11],
	'Neoploitan Major':           [0,1,3,5,7,9,11],
	'Neopolitan Minor':           [0,1,3,5,7,8,10],
	'Nine Tone Scale':            [0,2,3,4,6,7,8,9,11],
	'Overtone':                   [0,2,4,6,7,9,10],
	'Overtone Dominant':          [0,2,4,6,7,9,10],
	'Pelog':                      [0,1,3,7,8],
	'Persian':                    [0,1,4,5,6,8,11],
	'Prometheus':                 [0,2,4,6,9,10],
	'Prometheus Neopolitan':      [0,1,4,6,9,10],
	'Roumanian Minor':            [0,2,3,6,7,9,10],
	'Six Tone Symmetrical':       [0,1,4,5,8,9],
	'Spanish Gypsy':              [0,1,4,5,7,8,10],
	'Super Locrian':              [0,1,3,4,6,8,10],
	'Moorish Phrygian':           [0,1,3,4,5,7,8,10,11],
	*/
};
module.exports.scales = scales;

//construct scale comparison matrices
var scale_matrices = {};
for(var scale in scales)
{
	var matrix = new Array2D(12, 12);
	var values = scales[scale];
	for(var x = 0; x < values.length; x++)
		for(var y = 0; y < values.length; y++)
			matrix[values[x]][values[y]] = 1;
	scale_matrices[scale] = matrix;
}

module.exports.scale_matrices = scale_matrices;
