/**
 * This is an example Wiki web application written on Pintura
 */
var pageFacets = require("./facet/page"),
	pageChangeFacets = require("./facet/page-change"),
	admins = require("perstore/util/settings").security.admins,
	copy = require("perstore/util/copy").copy,
	Restrictive = require("perstore/facet").Restrictive,
	FileSystem = require("perstore/store/filesystem").FileSystem, 
	File = require("pintura/media").getFileModel(),
	Model = require("perstore/model").Model,
	Notifying = require("perstore/store/notifying").Notifying,
	pinturaConfig = require("pintura/pintura").config,
	User = pinturaConfig.security.getAuthenticationFacet();

// registers the HTML representation handler that generates HTML from wiki content
require("./media/wiki-html");
// Defines the data model for the given user by request
pinturaConfig.getDataModel = function(request){
	var user = request.remoteUser;
	if(user){
		if(admins.indexOf(user)>-1){
			return fullModel; // admin users can directly access the data model without facets
		}
		return userModel;
	}
	return publicModel;
}
// we can use the class model for RESTful creation of models
var ClassModel = Model(Notifying(require("perstore/stores").DefaultStore()),{});
var fullModel = {
	Page: require("./model/page").Page,
	PageSuper: require("./model/page").PageSuper,
	PageChange: require("./model/page-change").PageChange,	
	User: User,
	File: File,
	Class: ClassModel,
	Module: FileSystem({dataFolder:"../lib"})
};
// initialize the data model
require("perstore/model").initializeRoot(fullModel);

// We can generate models from schemas stored in a store/model if we want
exports.DataModel = fullModel = require("perstore/model").createModelsFromModel(ClassModel, fullModel);


// the data model for non-authenticated users
var publicModel = {
	Page: pageFacets.PublicFacet,
	PageChange: pageChangeFacets.PublicFacet,
	User: User,
	File: File,
	Class: Restrictive(ClassModel)
};

// the data model for authenticated users 
var userModel = copy(publicModel, {});
userModel.Page = pageFacets.UserFacet;

