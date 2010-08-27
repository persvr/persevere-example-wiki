/**
 * The starting point for Pintura running as a Jack app.
 */
var pinturaApp;
require("nodules").useLocal().ensure(["pintura/pintura", "app", "tunguska/jack-connector", "narwhal/narwhal/repl"], function(require){
	require.reloadable(function(){
		pinturaApp = require("pintura/pintura").app;
		require("app");
	});
	require("tunguska/jack-connector").observe("worker", pinturaApp.addConnection);
	// we start the REPL (the interactive JS console) because it is really helpful
	if(require("jack/handler/simple-worker").options.firstWorker){
		require("narwhal/narwhal/repl").repl(true);
	}
});

var File = require("file"),
	Transporter = require("jsgi/transporter").Transporter;

var perseverePath, 
	Static = require("jack/static").Static,
	Directory = require("jack/dir").Directory;
	
var path = require.paths[0].match(/(.*?)[\/\\]packages[\/\\]/);
if(path){
	perseverePath = path[1] + "/packages/persevere/public";
}

// now setup the development environment, handle static files before reloading the app
// for better performance
exports.app = exports.development = function(app, options){
	// make the root url redirect to /Page/Root  
	return require("jsgi/redirect-root").RedirectRoot(
		require("jack/cascade").Cascade([
			// cascade from static to pintura REST handling
/*		// this will provide module wrapping for the Dojo modules for the client
		transporter.Transporter({
			urlPrefix:"/js/",
			paths:["../../persevere/public/js/"],
			converter: transporter.Dojo
		}),*/
		// the main place for static files accessible from the web
		Directory("public", Static(null, {urls:[""], root: "public"})),
		Static(null, {urls:["/explorer"], root: perseverePath + "/explorer"}),
		// this will provide access to the server side JS libraries from the client
		Transporter({loader: require("nodules").forEngine("browser").useLocal().getModuleSource}),
		
		 	// main Pintura handler 
			function(request){
				return pinturaApp(request);
			}
		])
	);
};
