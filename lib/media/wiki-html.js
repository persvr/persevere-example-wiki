/**
* Media handler for generating HTML from Wiki markup-based pages
*/

var Media = require("pintura/media").Media,
	escapeHTML = require("narwhal/html").escape,
	wikiToHtml = require("wiky/wiky").toHtml,
	template = require("promised-io/fs").read("templates/wiki.html");
		
	
Media({
	mediaType:"text/html",
	getQuality: function(object){
		return 0.95;
	},
	serialize: function(object, parameters, request, response){
		var pageName = escapeHTML(decodeURIComponent(request.pathInfo.substring(6)));
		var action;
		if(response.status === 404){
			action = "create";
			object = "This page does not exist yet" + 
				// make sure it shows up on browsers that alternately show "friendly 404's for small responses
				"                                                                                                                                                                                                                                                                                                            ";
		}
		else if(response.status === 200){
			action = "edit";
		}
		var content;
		if(typeof object === "object"){
			content = wikiToHtml(object.content);
		}
		else{
			content = "<p>" + object + "</p>\n";
		}
		if(action){
			action = '<p><a href="/edit.html?page=' + pageName + '">' + action + ' this page</a></p>\n';
		}else{
			action = '';
		}	
		var props = {
			pageName: pageName,
			content: content,
			action: action, 
			location: response.headers.location
		};
		return [template.replace(/\$\{(\w+)\}/g, function(t, prop){
			return props[prop];
		})];
	}
});

var rules = require("wiky/wiky").rules,
	store = require("wiky/wiky").store;
// add a rule for [[target page]] style links
rules.wikiinlines.push({ rex:/\[\[([^\]]*)\]\]/g, tmplt:function($0,$1,$2){return store("<a href=\""+$1+"\">"+$1+"</a>");}});
