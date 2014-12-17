
var fs      = require("fs");
var async   = require('async');
var config  = require("./config.js");
var Array2D = require('./Array2D.js');



function distance(matrix, scale)
{
	var scale_matrix = config.scale_matrices[scale];
	var d = 0;
	matrix.forEach(function(v, x, y) {
		d += Math.abs(v - scale_matrix[x][y]);
	});
	return d;
}

module.exports = function(matrix, key) {

	//adjust the matrix for the given key
	var key_adjusted_matrix = new Array2D(12, 12);

	matrix.forEach(function(v, x, y) {
		x = (x + key) % 12;
		y = (y + key) % 12;
		key_adjusted_matrix[x][y] = v;
	});

	var best_scale = "Unknown";
	var best_distance = -1;

	for(var scale in config.scales)
	{
		var d = distance(key_adjusted_matrix, scale);

		if((best_distance == -1) || (d < best_distance))
		{
			best_scale = scale;
			best_distance = d;
		}
	}

	return best_scale;
};
