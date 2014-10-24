
var Array2D = require("./Array2D.js");

var Matrix = function() {

	//init the matrix
	var matrix = new Array2D(12, 12, 0); // 12x12, default = 0
	var largest = 0;

	this.add = function(a, b) {
		a = a % 12;
		b = b % 12;
		matrix[a][b]++;

		//update the largest value
		if(matrix[a][b] > largest)
			largest = matrix[a][b];
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

	this.log = function() {
		matrix.log();
	};
};

Matrix.prototype.distance = function(other) {

};

module.exports = Matrix;
