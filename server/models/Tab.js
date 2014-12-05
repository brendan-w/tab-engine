
var mongoose = require('mongoose');
var _ = require('underscore');

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

    owner: 	{
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},
    
    matrix: {
        type: Object,
        required: true,
    },

    createdData: {
        type: Date,
        default: Date.now
    }

});

TabSchema.methods.toAPI = function() {
    return {
        tab: this.tab,
        name: this.name,
        artist: this.artist,
        url: this.toURL(),
    };
};

TabSchema.statics.findByOwner = function(ownerId, callback) {

    var search = {
        owner: mongoose.Types.ObjectId(ownerId)
    };

    return TabModel.find(search).select("name artist tab").exec(callback);
};

TabSchema.statics.findByID = function(tabID, callback) {
    var search = {
        _id: mongoose.Types.ObjectId(tabID)
    };

    return TabModel.findOne(search, callback);
};

TabSchema.methods.toURL = function() {
    return "/tab/" + this._id;
};


TabModel = mongoose.model('Tab', TabSchema);


module.exports.TabModel  = TabModel;
module.exports.TabSchema = TabSchema;