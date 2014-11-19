var w = 16;
var h = 6;

//init the 2D array
var inputs = [];
for(var i = 0; i < w; i++)
{
	inputs[i] = [];
}


function isNumberKey(e){
	var charCode = (e.which) ? e.which : e.keyCode;
	if(charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	return true;
}


window.onload = function() {

	var _inputs = document.querySelectorAll("pre input");

	[].forEach.call(_inputs, function(input, i) {
		input.type = "text";
		input.setAttribute("maxlength", "2");
		input.setAttribute("placeholder", "──");

		var x = i % w;
		var y = Math.floor(i / w);

		input.setAttribute("x", x);
		input.setAttribute("y", y);
		inputs[x][y] = input;
		input.onkeypress = isNumberKey;
	});

	document.onkeydown = function(e) {
		var k = e.keyCode;
		var current = document.activeElement;

		if(current.nodeName == "INPUT" && (k >= 37) && (k <= 40))
		{
			e.preventDefault();
			var x = parseInt(current.getAttribute("x"));
			var y = parseInt(current.getAttribute("y"));

			switch(k)
			{
				case 37: //left
					if(x > 0) x--;
					break;
				case 38: //up
					if(y > 0) y--;
					break;
				case 39: //right
					if(x != w - 1) x++;
					break;
				case 40: //down
					if(y != h - 1) y++;
					break;
			}

			inputs[x][y].focus();
		}
	};
};
