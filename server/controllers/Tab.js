
var models = require('../models');

var Tab = models.Tab;

var uploadPage = function(req, res) {
	
	Tab.TabModel.findByOwner(req.session.account._id, function(err, docs) {

		if(err) {
			console.log(err);
			return res.status(400).json({error:'An error occurred'}); 
		}
		
		res.render('app', {Tabs: docs});
	});
};

var upload = function(req, res) {

	var tab = req.body.tab;
	var name = req.body.name;
	var artist = req.body.artist;

	if(!tab || !name || !artist)
	{
		return res.status(400).json({error: "All fields are required"});
	}
	
	var newTab = new Tab.TabModel({
		tab: tab,
		name: name,
		artist: artist,
	});
	
	newTab.save(function(err) {
		if(err) {
			console.log(err);
			return res.status(400).json({error:'An error occurred'}); 
		}

		res.json({redirect: '/account'});
	});
	
};

module.exports.uploadPage = uploadPage;
module.exports.upload = upload;
