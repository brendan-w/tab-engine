
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

var Matrix = function(frames) {

	//init the matrix
	var m = new ArrayND(12, 12, 12); // 12x12
	var largest = 0;

	this.getM = function() { return m; };
	this.getLargest = function() { return largest; };

	function add(a, b, c)
	{
		coord = [a,b,c];
		var v = m.get(coord);
		v++;
		m.set(coord, v);

		//update the largest value
		if(v > largest)
			largest = v;
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
};

//Note: this operation is NOT commutative
Matrix.prototype.compare = function(that) {
	var m1 = this.getM(); //this matrix (seed from user)
	var m2 = that.getM(); //the submitted matrix (from the DB)

	//the distance between this, and the given matrix
	//0 = all patterns in this matrix are present in the given matrix
	//each discrepency increments the distance by 1
	//as of now, the relative magnitudes are not considered
	var d = 0;

	m1.forEach(function(v1, c, a) {
		//where there's data in M1, there must also be data in M2, else, increase the distance
		if(v1 !== 0)
		{
			var v2 = m2.get(c);
			if(v2 === 0)
			{
				d++;
				//console.log(c, v1, v2);
			}
		}
	});

	return d;
};


module.exports = Matrix;
