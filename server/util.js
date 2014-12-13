
module.exports.queryToTab = function(query) {
	
	var frames = [];

	function addFrame()
	{
		frames.push(["","","","","",""]);
	}

	for(var key in query)
	{
		//search got nX_Y    (n3_5) ---> (3, 5)
		if(/n[0-9]+_[0-9]+/.test(key))
		{
			var value  = query[key];
			var coords = key.substr(1).split('_');
			var x = parseInt(coords[0]);
			var y = parseInt(coords[1]);

			//add the neccessary frames
			while(x >= frames.length)
				addFrame();

			frames[x][y] = value.toString();
		}
	}

	//turn the matrix into a tab string
	var output = "";
	for(var y = 0; y < 6; y++)
	{
		output += "|--";
		for(var x = 0; x < frames.length; x++)
		{
			var note = frames[x][y];
			while(note.length < 2)
				note += "-";
			output += note + "--";
		}
		output += "|\n";
	}

	return output;
};
