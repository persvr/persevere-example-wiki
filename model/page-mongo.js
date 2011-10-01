/**
 * This provides the definition of the mongo store if used
 */

var MongoDB = require("perstore/store/mongodb").MongoDB,
	// url takes this form - mongodb://<user>:<password>@<mongo-server>:<port>/<database>
	url = process.env.MONGO_URL;

exports.pageStore = MongoDB({
	collection: "Page",
	url: url
});

exports.pageChangeStore = MongoDB({
	collection: "PageChange",
	url: url
});