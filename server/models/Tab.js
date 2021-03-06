
var mongoose   = require('mongoose');
var parse      = require('../parser');
var beautify   = require('../util.js').beautify;
var _          = require('underscore');

var TabModel;

var setText = function(name) {
    return _.escape(name).trim();
};

var TabSchema = new mongoose.Schema({
    tab: {
        type: String,
        required: true,
        trim: true,
        set: setText,
    },
    
    name: {
        type: String,
        required: true,
        trim: true,
        set: setText,
    },
    
    artist: {
        type: String,
        required: true,
        trim: true,
        set: setText,
    },

    tuning: {
        type: String,
        required: true,
        trim: true,
        set: setText,
    },

    key: {
        type: String,
        required: true,
        trim: true,
        set: setText,
    },

    scale: {
        type: String,
        required: true,
        trim: true,
        set: setText,
    },

    owner: 	{
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},

    createdData: {
        type: Date,
        default: Date.now
    }
});

TabSchema.index({
    name: 'text',
    artist: 'text'
});

//factory for Tab objects
TabSchema.statics.newTab = function(tab_props) {
    
    tab_props.tuning = "Unknown";
    tab_props.key = "Unknown";
    tab_props.scale = "Unknown";

    //preprocess
    try
    {
        tab_props = parse(tab_props); //it looks so simple
    }
    catch(e)
    {
        /* not a whole lot I can do about this... */
    }

    tab_props.tab = beautify(tab_props.tab); //make it pretty

    //create the new tab
    return new TabModel(tab_props);
};


TabSchema.statics.findByOwner = function(ownerId, callback) {
    var search = {
        owner: mongoose.Types.ObjectId(ownerId)
    };

    return TabModel.find(search).exec(callback);
};

TabSchema.statics.findByID = function(tabID, callback) {
    var search = {
        _id: mongoose.Types.ObjectId(tabID)
    };

    return TabModel.findOne(search, callback);
};



TabModel = mongoose.model('Tab', TabSchema);

module.exports.TabModel  = TabModel;
module.exports.TabSchema = TabSchema;
