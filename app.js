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
	pintura = require("pintura/pintura"),
	pinturaConfig = pintura.config,
	access = require("pintura/jsgi/access"),
	User = pinturaConfig.security.getAuthenticationFacet();

// registers the HTML representation handler that generates HTML from wiki content
require("./media/wiki-html");
// Defines the data model for the given user by request
pintura.registerModels({
	User: User,
	Page: [
		{
			model: require('./model/page').Page,
			groups: ['admin']
		},
		{
			model: pageFacets.UserFacet,
			groups: ['user']
		},
		{
			model: pageFacets.PublicFacet,
			groups: ['public']
		}
	],
	PageChange: [
		{
			model: require('./model/page-change').PageChange,
			groups: ['admin']
		},
		{
			model: pageChangeFacets.PublicFacet,
			groups: ['user', 'public']
		}
	]
}, {
	groups: ['admin', 'user'],
	models: {
		File: File
	}
});

access.groupsUsers = {
	admin: ['kris'],
	user: ['*'],
	public: [null]
};