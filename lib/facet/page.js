/**
 * These are the page facets for the Wiki example application (in progress)
 */

var Page = require("../model/page").Page,
	Permissive = require("perstore/facet").Permissive,
	Restrictive = require("perstore/facet").Restrictive;


// These are the different facets that are available for accessing this data
// This facet uses the Restrictive constructor, so any modifying action must be explicilty
// be enabled (by defining a handler) 
exports.PublicFacet = Restrictive(Page, {
	query: function(query, options){
		query = "status=published&" + query;
		Page.checkQuery(query);
		return Page.query(query, options);
	},
	subscribe: function(){
		return Page.subscribe.apply(Page, arguments);
	},
	prototype: {
	}
});

// This facet has for authenticated users and grants read and write capabilities
exports.UserFacet = Permissive(Page, {
	properties: {
	}
});

// This facet is for administrators and grants full access to data
exports.AdminFacet = Permissive(Page, {
	properties: {
	}
});
