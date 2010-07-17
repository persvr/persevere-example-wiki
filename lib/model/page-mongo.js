/**
 * This provides the definition of the mongo store if used
 */

var MongoDB = require("perstore/store/mongodb").MongoDB;

exports.pageStore = MongoDB({
	collection: "Page",
	url: process.env.MONGO_URL
});

exports.pageChangeStore = MongoDB({
	collection: "PageChange",
	url: process.env.MONGO_URL
});