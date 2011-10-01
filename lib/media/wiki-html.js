/**
* Media handler for generating HTML from Wiki markup-based pages
*/

var Media = require("pintura/media").Media,
	wikiToHtml = require("wiky/lib/wiky").toHtml,
	escapeHTML = function(string) {
	    return String(string)
	        .replace(/&/g, "&amp;")
	        .replace(/</g, "&lt;")
	        .replace(/>/g, "&gt;");
	};
	
	
require("pintura/media/html").setupMediaHandler({
	defaultQuality:1, 
	createContext: function(object, mediaParams, request, response){
		return {
			pageName: escapeHTML(decodeURIComponent(request.pathInfo.replace(/^\/Page\//, ''))),
			content: (typeof object=='object')?wikiToHtml(object.content):"<p>"+object+"</p>",
			location: response.headers.location
		}
	}
});	
	
var rules = require("wiky/lib/wiky").rules,
	store = require("wiky/lib/wiky").store;
// add a rule for [[target page]] style links
rules.wikiinlines.push({ rex:/\[\[([^\]]*)\]\]/g, tmplt:function($0,$1,$2){return store("<a href=\""+$1+"\">"+$1+"</a>");}});
