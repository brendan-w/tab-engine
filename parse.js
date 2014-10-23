
var frames = [];

var digitChars = /[0-9]/;
var lineChars = /[-─]/;
var rowDividers = /\n\s*\n/;


function parse(tab)
{
	rows = tabToRows(tab);

	rows.forEach(function(row) {
		strings = rowToStrings(rows);

		if(strings.length == 6)
		{
			var columns = stringsToColumns();
		}
		else
		{
			console.log("invalid number of strings");
		}
	});

}

function tabToRows(tab)
{
	return tab.split(rowDividers);
}

function rowToStrings(row)
{
	var lines = row.split(/\n/);
	var strings = [];

	//filter for only lines with line chars
	lines.forEach(function(line) {
		if(lineChars.test(line))
			strings.push(line);
	});

	return strings;
}


function stringsToColumns(strings)
{
	var columns = [];
	for(var i = 0; i < largest(strings); i++)
	{
		var column = 
		columns.push()
	}
}


function largest(arrays)
{
	var max = 0;
	arrays.forEach(function(arr) {
		if(arr.length > max)
			max = arr.length;
	});
	return max;
}