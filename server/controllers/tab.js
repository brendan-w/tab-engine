
var models = require('../models');
var parse  = require('../parser');

var Tab = models.Tab;

var tabPage = function(req, res) {

	Tab.TabModel.findByID(req.param('tabid'), function(err, doc) {

		if(err)
		{
			console.log(err);
			return res.status(400).json({error:'An error occurred'});
		}

		res.render('tab', {
			tab: doc.toAPI(),
			logged_in: req.session.account !== undefined,
		});
	});
};

var uploadPage = function(req, res) {
	res.render('upload');
};

var upload = function(req, res) {

	var tab    = req.body.tab;
	var name   = req.body.name;
	var artist = req.body.artist;

	if(!tab || !name || !artist)
	{
		return res.status(400).json({error: "All fields are required"});
	}
	

	var matrix = parse(tab); //it looks so simple

	//create the new tab
	var newTab = new Tab.TabModel({
		tab: tab,
		name: name,
		artist: artist,
		owner: req.session.account._id,
		matrix: matrix.getM(),
	});
	
	newTab.save(function(err) {
		if(err)
		{
			console.log(err);
			return res.status(400).json({error:'An error occurred'}); 
		}

		res.json({redirect: '/account'});
	});
};

module.exports.tabPage    = tabPage;
module.exports.uploadPage = uploadPage;
module.exports.upload     = upload;
