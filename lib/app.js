/**
 * This is an example Wiki web application written on Pintura
 */
var pageFacets = require("./facet/page"),
	pageChangeFacets = require("./facet/page-change"),
	admins = require("commonjs-utils/settings").security.admins,
	fullModel = require("./model/index").DataModel,
	copy = require("commonjs-utils/copy").copy,
	Restrictive = require("perstore/facet").Restrictive,
	File = require("pintura/media").getFileModel(),
	User = require("pintura/pintura").config.security.getAuthenticationFacet();

// registers the HTML representation handler that generates HTML from wiki content
require("media/wiki-html");

// Defines the data model for the given user by request
exports.getDataModel = function(request){
	var user = request.remoteUser;
	if(user){
		if(admins.indexOf(user)>-1){
			return fullModel; // admin users can directly access the data model without facets
		}
		return userModel;
	}
	return publicModel;
}

fullModel.User = User;
fullModel.File = File; 

// initialize the data model
require("perstore/model").initializeRoot(fullModel);

// the data model for non-authenticated users
var publicModel = {
	Page: pageFacets.PublicFacet,
	PageChange: pageChangeFacets.PublicFacet,
	User: User,
	File: Restrictive(File), 
	Class: Restrictive(fullModel.Class)
};

// the data model for authenticated users 
var userModel = copy(publicModel, {});
userModel.Page = pageFacets.UserFacet

