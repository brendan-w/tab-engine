
/*

A tab signiture is derived from an interval matrix like such:
	where x axis = any given note in the tab  (n)
	and y axis   = the next note in the tab   (n+1)
	and the value at (x,y) is the number of times this interval occured


    C C# D D# E F F# G G# A A# B
    ____________________________
C  |
C# |     6
D  |  3           2  7
D# |
E  |                  4
F  |            1
F# |            9
G  |
G# |
A  |     1
A# |                     8
B  |         15             4  5


The matrix is then normalized [0-255] and rendered in row-major hex, and should look something like this (288 chars of hex):

D000900D0000000ACC007FAE74747950FA700200004100CB440EEB007C190000B93C667900CD0737003900B93C00000000D9CFB200BA00DCC50000E2005C00009E7ABE008C0096070045D300FE06FD7500EE5B0000E65999009FCC0000004C9DFA1FCDD64F75F6C2A21CACE3FE006922004322C84E0000D1DE005C3ACF4100000000AE0061A5BDB0CE9CA500DF390000

*/

var ArrayND = require("./ArrayND.js");

var Matrix = function(frames) {

	//init the matrix
	var matrix = new ArrayND(12, 12); // 12x12
	var largest = 0;

	function add(a, b)
	{
		a = a % 12; //octave data is irrelevant here
		b = b % 12;
		matrix[a][b]++;

		//update the largest value
		if(matrix[a][b] > largest)
			largest = matrix[a][b];
	}

	//add every interval to the matrix
	for(var f = 0; f < frames.length - 1; f++)
	{
		var frameA = frames[f];
		var frameB = frames[f+1];

		//k-graph for note intervals
		for(var a = 0; a < frameA.length; a++)
			for(var b = 0; b < frameB.length; b++)
				add(frameA[a], frameB[b]);
	}


	this.distance = function(other) {

	};

	this.toHex = function() {
		var hex = "";
		matrix.forEach(function(v) {
			//normalize
			v = Math.round(v / largest * 255);
			//print hex
			hex += v.toString(16);
		});
		return hex;
	};
};


module.exports = Matrix;
