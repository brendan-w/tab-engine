
var fs = require("fs");
var async  = require('async');
var config = require("./config.js");


function distance(matrix, scale)
{
	var scale_matrix = config.scale_matrices[scale];
	var d = 0;
	matrix.forEach(function(v, x, y) {
		var diff = Math.abs(v - scale_matrix[x][y])
		d += Math.pow(diff, 2);
	});
	return d;
}

module.exports = function(matrix, key) {
	var search = [];

	var best_scale = "Unknown";
	var best_distance = -1;

	for(var scale in config.scales)
	{
		var d = distance(matrix, scale);
		if((best_distance == -1) || (d < best_distance))
		{
			best_scale = scale;
			best_distance = d;
		}
	}

	return best_scale;
};
