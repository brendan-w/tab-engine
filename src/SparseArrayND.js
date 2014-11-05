
/*
	N-dimensional arrays for JavaScript

	Written by Brendan Whitfield
*/


/*
 * ArrayND Constructor
 * 
 * new ArrayND(<ArrayND>);
 * new ArrayND(<x>, <y>, <z>, <w>, etc..);
 */
var SparseArrayND = function() {
	"use strict";

	var root = this;

	this.default = 0;


	function build(d, current)
	{
		if(d === root.dimensions - 1)
		{
			return;
			//dont fill with data
			/*
			for(var i = 0; i <= root.end[d]; i++)
			{
				current[i] = root.default;
			}
			*/
		}
		else if(d < root.dimensions)
		{
			for(var i = 0; i <= root.end[d]; i++)
			{
				current[i] = {}; //create the next level
				build(d+1, current[i]) //fill the next level
			}
		}
	}

	if(arguments.length === 1 && arguments[0] instanceof ArrayND)
	{
		//copy constructor
		var other = arguments[0];

		//copy properties
		this.dimensions = other.dimensions;
		this.start      = Array.prototype.slice.call(other.start);
		this.end        = Array.prototype.slice.call(other.end);
		this.length     = other.length;

		build(0, this);

		//copy values		
		this.forRange(this.start, this.end, function(v, c, a) {
			root.set(c, other.get(c));
		});
	}
	else
	{
		//normal n-dimensional constructor
		this.dimensions = arguments.length;
		this.size       = Array.prototype.slice.call(arguments);
		this.length     = this.size.reduce(function(a,b) { return a*b; });
		this.start      = [];
		this.end        = [];

		for(var d = 0; d < this.dimensions; d++)
		{
			this.start.push(0);
			this.end.push(this.size[d] - 1);
		}

		build(0, this);
	}
};

SparseArrayND.prototype.__assert__ = {

	validCoordinate : function(coordinate) {
		if(!(coordinate instanceof Array))
		{
			throw "SparseArrayND: Invalid coordinate type: " + (typeof coordinate);
		}

		if(coordinate.length !== this.dimensions)
		{
			throw "SparseArrayND: Invalid number of dimensions in coordinate: [" + coordinate.join(", ") + "]";
		}

		for(var d = 0; d < coordinate.length; d++)
		{
			if(coordinate[d] < 0)
				throw "SparseArrayND: Invalid coordinate. Index less than zero: [" + coordinate.join(", ") + "]";
			if(coordinate[d] > this.end[d])
				throw "SparseArrayND: Invalid coordinate. Index greater than length: [" + coordinate.join(", ") + "]";
		}
	},

	isFunction : function(func) {
		if(!(func instanceof Function))
			throw "SparseArrayND: Invalid callback type: " + (typeof func);
	},
};

SparseArrayND.prototype.get = function(coordinate) {
	this.__assert__.validCoordinate.call(this, coordinate);

	var root = this;
	var last = coordinate.length - 1;

	//[2,3,1]  --->  root[2][3][1]
	for(var d = 0; d < last; d++)
		root = root[coordinate[d]];

	var e = root[coordinate[last]];

	//if there this coordinate was not defined, return the default (virtual value)
	if(e != undefined)
		return e;
	else
		return this.default;
		
};

SparseArrayND.prototype.set =function(coordinate, value) {
	this.__assert__.validCoordinate.call(this, coordinate);

	var root = this;
	var last = coordinate.length - 1;
	value = !value ? this.default : value;

	//[2,3,1]  --->  root[2][3][1]
	for(var d = 0; d < last; d++)
		root = root[coordinate[d]];

	//all default elements don't exist
	if(value == this.default)
		delete root[coordinate[last]];
	else
		root[coordinate[last]] = value;
};

/*
	start = [] coordinates
	end = [] coordinates
	callback = function(value, coordinates, SparseArrayND)
*/
SparseArrayND.prototype.forRange = function(start, end, callback) {
	this.__assert__.validCoordinate.call(this, start);
	this.__assert__.validCoordinate.call(this, end);
	this.__assert__.isFunction.call(this, callback);

	var root = this;
	var coordinates = [];

	function iterate(d, current)
	{
		if(d === root.dimensions - 1)
		{
			for(var i = start[d]; i <= end[d]; i++)
			{
				coordinates[d] = i;
				callback(root.get(coordinates), coordinates, root); //reached a value
			}
		}
		else if(d < root.dimensions)
		{
			for(var i = start[d]; i <= end[d]; i++)
			{
				coordinates[d] = i;
				iterate(d+1, current[i]) //recurse to the next level
			}
		}
	}

	iterate(0, root);
};

SparseArrayND.prototype.forEach = function(callback) {
	this.forRange(this.start, this.end, callback);
};

SparseArrayND.prototype.fillRange = function(start, end, value) {

	var root = this;
	value = !value ? this.default : value;

	this.forRange(this.start, this.end, function(v, c, a) {
		root.set(c, value);
	});
};

SparseArrayND.prototype.fill = function(value) {
	this.fillRange(this.start, this.end, value);
};

module.exports = SparseArrayND;