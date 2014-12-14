
var models   = require('../models');

//models
var TabModel = models.Tab.TabModel;


module.exports.tabPage = function(req, res) {

	var tab_id = req.query.tabid;

	TabModel.findByID(tab_id, function(err, doc) {

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

module.exports.uploadPage = function(req, res) {
	res.render('upload');
};

module.exports.upload = function(req, res) {

	var tab    = req.body.tab;
	var name   = req.body.name;
	var artist = req.body.artist;

	if(!tab || !name || !artist)
	{
		return res.status(400).json({error: "All fields are required"});
	}
	
	//create the new tab
	var newTab = TabModel.newTab({
		tab: tab,
		name: name,
		artist: artist,
		owner: req.session.account._id,
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

module.exports.deletePage = function(req, res) {
	var tab_id = req.query.tabid;

	TabModel.findByID(tab_id, function(err, doc) {
		if(err)
		{
			console.log(err);
			return res.redirect('/account');
		}
		else
		{
			res.render('delete', { tab: doc.toAPI() });
		}
	});
};


module.exports.delete = function(req, res) {
	var tab_id = req.body.tabid;

	var query = {
		_id:   tab_id,
		owner: req.session.account._id,
	};

	TabModel.remove(query, function(err) {
		if(err)
			console.log(err);
		res.redirect("/account");
	});
};


module.exports.searchPage = function(req, res) {

	res.render('search', {
		tabs:[],
		logged_in: req.session.account !== undefined,
	});
};
