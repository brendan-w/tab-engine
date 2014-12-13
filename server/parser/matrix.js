
/*

A tab signiture is derived from an interval matrix like such:
	where x axis = any given note in the tab  		(n)
	and y axis   = the next note in the tab  	 	(n+1)
	and z axis   = the next-next note in the tab	(n+2)
	and the value at (x,y,z) is the number of times this interval occured


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


etc... for more dimensions

*/

var ArrayND = require("./SparseArrayND.js");

module.exports = function(frames) {

	//init the matrix
	var matrix = new ArrayND(12, 12, 12);
	var largest = 0;

	function add(a, b, c)
	{
		coord = [a,b,c];
		var v = matrix.get(coord);
		v++;
		matrix.set(coord, v);

		//update the largest value
		if(v > largest)
			largest = v;
	}

	//add every interval to the matrix
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

	return {
		matrix: matrix,
		largest: largest,
	};
};
