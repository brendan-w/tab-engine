
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
	var m = new ArrayND(12, 12, 12); // 12x12
	var largest = 0;

	function add(a, b, c)
	{
		a = a % 12; //octave data is irrelevant here
		b = b % 12;
		c = c % 12;
		m[a][b][c]++;

		//update the largest value
		if(m[a][b][c] > largest)
			largest = m[a][b][c];
	}

	//add every interval to the m
	for(var f = 0; f < frames.length - 2; f++)
	{
		var fA = frames[f];
		var fB = frames[f+1];
		var fC = frames[f+2];

		//k-graph for note intervals
		for(var a = 0; a < fA.length; a++)
			for(var b = 0; b < fB.length; b++)
				for(var c = 0; c < fC.length; c++)
					add(fA[a], fB[b], fC[c]);
	}

	//the array is sparse, so delete unnecessary values
	m.forEach(function(v, c, a) {
		if(v === 0)
			delete a[c[0]][c[1]][c[2]];
		else
			console.log(c, v);
	});
};


module.exports = Matrix;
