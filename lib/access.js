/**
 * Defines the capabilities of different users
 */
var pageFacets = require("facet/page"),
	pageChangeFacets = require("facet/page-change"),
	admins = require("commonjs-utils/settings").admins,
	Register = require("pintura/security").Register,
	security = require("pintura/pintura").config.security;

security.getAllowedFacets = function(user, request){
	if(user){
		if(admins.indexOf(user.name)>-1){
			return [pageFacets.AdminFacet, pageChangeFacets.AdminFacet];
		}
		return [pageFacets.UserFacet, pageChangeFacets.PublicFacet];
	}
	return [pageFacets.PublicFacet, pageChangeFacets.PublicFacet, Register];
};
