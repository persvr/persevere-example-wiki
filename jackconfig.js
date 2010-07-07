/**
 * The starting point for Pintura running as a Jack app.
 */
try{
	var pintura = require("pintura/pintura");
}catch(e){
	// old loaders need to use this type of access, pintura will fix things from there 
	require("./lib/util/narwhal-compat");
	pintura = require("pintura/pintura");
}

var File = require("file"),
	transporter = require("transporter/jsgi/transporter");

require("app");
// setup the Jack application
exports.app =
	// this will provide module wrapping for the server side CommonJS libraries for the client
	transporter.Transporter({loader: function(id){
		if(id.match(/promised-io/)){
			id = id.replace(/promised-io\/http-client/,'http-client');
		}
		return require.loader.loader.fetch(require.loader.resolvePkg(id.substring(0, id.length - 3),"","","")[0]);
	}}, 
		// make the root url redirect to /Page/Root  
		require("jsgi/redirect-root").RedirectRoot(
		 	// main Pintura handler 
			pintura.app
		)
	);


var perseverePath;
var path = require.paths[0].match(/(.*?)\/packages\//);
if(path){
	perseverePath = path[1] + "/packages/persevere/public";
}
// now setup the development environment, handle static files before reloading the app
// for better performance
exports.development = function(app, options){
	return require("jack/cascade").Cascade([
			// cascade from static to pintura REST handling
/*		// this will provide module wrapping for the Dojo modules for the client
		transporter.Transporter({
			urlPrefix:"/js/",
			paths:["../../persevere/public/js/"],
			converter: transporter.Dojo
		}),*/
		// the main place for static files accessible from the web
		require("jack/static").Static(null, {urls:[""],root:"public"}),
		require("jack/static").Static(null, {urls:["/explorer"],root:perseverePath}),
		require("jack/static").Static(null, {urls:["/js/dojo-persevere"],root:perseverePath}),
		// the typical reloader scenario
		(!options || options.reload) ? require("jack/reloader").Reloader(File.join(File.cwd(), "jackconfig"), "app") :
								exports.app
	]);
};

require("tunguska/jack-connector").observe("worker", pintura.app.addConnection);

// we start the REPL (the interactive JS console) because it is really helpful
new (require("worker").SharedWorker)("narwhal/repl");

