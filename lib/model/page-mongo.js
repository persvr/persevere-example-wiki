/**
 * This provides the definition of the mongo store if used
 */

var MongoDB = require("../store/mongodb").MongoDB;

exports.pageStore = MongoDB({
	collection: "Page"
});

exports.pageChangeStore = MongoDB({
	collection: "PageChange"
});