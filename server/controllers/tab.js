
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
			tab: doc,
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
		tuning: "TEMP",
		key: "TEMP",
		scale: "TEMP",
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
			res.render('delete', { tab: doc });
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

	var search = {};
	
	if(req.query.song)
		search.song = req.query.song;
	if(req.query.artist)
		search.artist = req.query.artist;
	if(req.query.key)
		search.key = req.query.key;
	if(req.query.tuning)
		search.tuning = req.query.tuning;
	if(req.query.scale)
		search.scale = req.query.scale;

	TabModel.find(search, function(err, docs) {
		if(err)
		{
			console.log(err);
			docs = [];
		}

		res.render('search', {
			tabs:docs,
			logged_in: req.session.account !== undefined,
		});
	});
};
