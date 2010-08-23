/**
* Media handler for generating HTML from Wiki markup-based pages
*/

var Media = require("pintura/media").Media,
	escapeHTML = require("narwhal/html").escape,
	wikiToHtml = require("wiky/wiky").toHtml; 
		
	
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
		return {
			forEach:function(write){
				write('<html><title>' + pageName + '</title>\n');
				write('<link rel="stylesheet" href="/css/common.css">\n');
				write('<link rel="stylesheet" href="/css/wikiContent.css">\n');
				if(response.headers.location){
					write('<link rel="self" href="' + response.headers.location + '">\n');
				}
				write('<script src="/lib/transporter/receiver.js"></script>\n');
				write('<script src="/lib/monitor.js"></script>\n');
				write('<body><div id="headerContainer"><span class="pageName">' + pageName + '<span></div>\n');
				write('<div id="content">\n');
				if(typeof object === "object"){
					write('' + wikiToHtml(object.content));
				}
				else{
					write("<p>" + object + "</p>\n");
				}
				if(action){
					write('<p><a href="/edit.html?page=' + pageName + '">' + action + ' this page</a></p>\n');
				}	
				write('</div></body></html>\n');
			}
		};
	}
});

var rules = require("wiky/wiky").rules,
	store = require("wiky/wiky").store;
// add a rule for [[target page]] style links
rules.wikiinlines.push({ rex:/\[\[([^\]]*)\]\]/g, tmplt:function($0,$1,$2){return store("<a href=\""+$1+"\">"+$1+"</a>");}});
