
var async      = require("async");
var importURL  = require('../util.js').importURL;
var tabTest    = require('../parser/config.js').stringTest;
var models     = require('../models');

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


module.exports.importPage = function(req, res) {
	res.render('import');
};


module.exports.import = function(req, res) {

	//discrete urls
	var urls = [];

	if(req.body.tabs)
	{
		req.body.tabs.split(/[\s,]/).forEach(function(v) {
			if(v) urls.push(v);
		});

	}
	else if((req.body.random) && (req.body.random < 1000))
	{
		//random mode
		for(var i = 0; i < req.body.random; i++)
			urls.push("http://www.ultimate-guitar.com/search.php?random=Get+random&type=200");
	}



	//start downloading
	async.map(urls, importURL, function(err, tabs) {		
		var newTabs = [];

		for(var i = 0; i < tabs.length; i++)
		{
			var tab = tabs[i];

			
			//test that this is actually a tab, and not a bunch of parse errors
			if(tabTest.test(tab.tab) &&
				!/[<>]/.test(tab.tab) &&
				!/[<>]/.test(tab.song) &&
				!/[<>]/.test(tab.artist) &&
				tab.song.length < 50 &&
				tab.artist.length < 50)
			{
				newTabs.push(TabModel.newTab({
					tab: tab.tab,
					name: tab.song,
					artist: tab.artist,
					owner: req.session.account._id,
				}));
			}
		}

		function saveTab(tab, save_callback)
		{
			tab.save(save_callback);
		}

		//save all the tabs to the DB
		async.map(newTabs, saveTab, function(err) {
			// res.redirect("/import");
			res.redirect("/account");
		});
	});
};


module.exports.searchPage = function(req, res) {

	var search = {};
	
	if(req.query.song)
		search.name = new RegExp(req.query.song + "", "i");
	if(req.query.artist)
		search.artist = new RegExp(req.query.artist + "", "i");
	if(req.query.key)
		search.key = req.query.key + "";
	if(req.query.tuning)
		search.tuning = req.query.tuning + "";
	if(req.query.scale)
		search.scale = req.query.scale + "";

	if(Object.keys(search).length === 0)
	{
		//nothing to search
		res.redirect('/');
	}
	else
	{
		//turn the text fields into regex

		//run the search
		TabModel.find(search).limit(50).exec(function(err, docs) {
			if(err)
			{
				console.log(err);
				docs = [];
			}

			res.render('search', {
				tabs:docs,
				search:{
					song: req.query.song,
					artist: req.query.artist,
					key: req.query.key,
					tuning: req.query.tuning,
					scale: req.query.scale,
				},
				logged_in: req.session.account !== undefined,
			});
		});
	}
};
