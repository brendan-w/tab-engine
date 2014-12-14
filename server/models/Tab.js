
var mongoose = require('mongoose');
var parse    = require('../parser');
var beautify = require('../beautify.js');
var ArrayND  = require("../parser/SparseArrayND.js");
var _        = require('underscore');

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
		required: false,
		ref: 'Account'
	},
    
    matrix: {
        type: Object,
        required: true,
    },

    largest: {
        type: Number,
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
        id: this._id,
    };
};

TabSchema.methods.getMatrix = function() {
    return new ArrayND(this.matrix);
};

//factory for Tab objects
TabSchema.statics.newTab = function(tab_props, callback) {
    
    //preprocess
    var matrix = parse(tab_props.tab); //it looks so simple
    tab_props.tab = beautify(tab_props.tab); //replace standard chars with prettier utf8 box-drawing chars

    tab_props.matrix = matrix.matrix;    
    tab_props.largest = matrix.largest;

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


TabSchema.statics.distance = function(this_tab, that_tab) {

    var m1 = this_tab.getMatrix(); //this matrix (seed from user)
    var m2 = that_tab.getMatrix(); //the submitted matrix (from the DB)

    //the distance between this, and the given matrix
    //0 = all patterns in this matrix are present in the given matrix
    //each discrepency increments the distance by 1
    //as of now, the relative magnitudes are not considered
    var d = 0;

    m1.forEach(function(v1, c, a) {
        //where there's data in M1, there must also be data in M2, else, increase the distance
        if(v1 !== 0)
        {
            var v2 = m2.get(c);
            if(v2 === 0)
            {
                d++;
            }
        }
    });

    return d;
}


//the magic search by tab content function
TabSchema.statics.findByTab = function(query_tab, callback) {

    var query = TabModel.newTab({
        tab: query_tab,
        name: "query",
        artist: "query",
    });


    //this is disgusting...
    TabModel.find().exec(function(err, docs) {
        if(err)
            callback(err);

        var passed = [];
        docs.forEach(function(doc) {
            if(TabModel.distance(query, doc) === 0)
                passed.push(doc);
        });

        callback(null, passed);
    })
};




TabModel = mongoose.model('Tab', TabSchema);

module.exports.TabModel  = TabModel;
module.exports.TabSchema = TabSchema;
