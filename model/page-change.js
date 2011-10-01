/**
 * This class is used for tracking all the changes of a page
 */

var Model = require("perstore/model").Model,
	DefaultStore = require("perstore/stores").DefaultStore,
	auth = require("pintura/jsgi/auth");

// This class contains  
var pageChangeStore = DefaultStore();
/* We can switch to different back-ends with:
// SQL:
pageChangeStore = SQLStore({
	table: "PageChange",
	idColumn: "id"
	indexedProperties:{
		id: true,
		pageId: true
	}
});
*/

// now we create a class, all central model logic is defined here 
exports.PageChange = Model(pageChangeStore, {
	properties: {
		content: String,
		pageId: {
			description:"This is the id for the current page from the Page model"
		}
	},
	links:[
		{
			rel: "current",
			href: "../Page/{pageId}"
		}
	]
});

// The facets for accessing the page class are defined in facet/page