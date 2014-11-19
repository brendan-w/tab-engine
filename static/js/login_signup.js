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

$(document).ready(function()
{
	
	$("form#signup button").on("click", function(e)
	{
		e.preventDefault();

		var username = $("input[name='username']").val();
		var password1 = $("input[name='password1']").val();
		var password2 = $("input[name='password2']").val();
		
		if(username === '' || password1 === '' || password2 === '')
		{
			handleError("All fields are required");
			return false;
		}
		
		if(password1 !== password2)
		{
			handleError("Passwords do not match");
			return false;		  
		}

		sendAjax($("form#signup").attr("action"), $("form#signup").serialize());
		
		return false;
	});


	$("form#login button").on("click", function(e)
	{
		e.preventDefault();

		var username = $("input[name='username']").val();
		var password = $("input[name='password']").val();

		if(username === '' || password === '')
		{
			handleError("All fields are required");
			return false;
		}
	
		sendAjax($("form#login").attr("action"), $("form#login").serialize());

		return false;
	});
});
