
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

var ArrayND = require("./ArrayND.js");

var Matrix = function(frames) {

	//init the matrix
	var m = new ArrayND(12, 12, 12); // 12x12
	var largest = 0;

	this.getM = function() { return m; };
	this.getLargest = function() { return m; };

	function add(a, b, c)
	{
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
	/*
	m.forEach(function(v, c, a) {
		if(v === 0)
			delete a[c[0]][c[1]][c[2]];
		else
			console.log(c, v);
	});
	*/

	/*
	m.forEach(function(v, c, a) {
		if(v !== 0)
			console.log(c, v);
	});
	*/
};

//Note: this operation is NOT commutative
Matrix.prototype.compare = function(that) {
	var m1 = this.getM();
	var m2 = that.getM();

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

	console.log(d);
};


module.exports = Matrix;
