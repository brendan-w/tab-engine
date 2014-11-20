
$(document).ready(function()
{
	
	$("form button").on("click", function(e)
	{
		e.preventDefault();

		var name = $("input[name='name']").val();
		var artist = $("input[name='artist']").val();
		var tab = $("textarea[name='tab']").val();
		
		if(name === '' || artist === '' || tab === '')
		{
			handleError("All fields are required");
			return false;
		}

		sendAjax($("form#tab").attr("action"), $("form#tab").serialize());

		return false;
	});
});
