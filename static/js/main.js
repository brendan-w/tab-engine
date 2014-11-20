
"use strict";

function handleError(message)
{
	$("form .problem").text(message).css("display", "block");
}

function sendAjax(action, data)
{
	$.ajax({
		cache: false,
		type: "POST",
		url: action,
		data: data,
		dataType: "json",
		success: function(result, status, xhr)
		{
			window.location = result.redirect;
		},
		error: function(xhr, status, error)
		{
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
}
