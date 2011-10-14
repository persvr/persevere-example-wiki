/**
 * The starting point for Pintura running as a Jack app.
 */

var Transporter, pinturaApp;
//require("nodules").useLocal().ensure(["pintura/pintura", "lib/app", "tunguska/jack-connector", "narwhal/lib/narwhal/repl", "transporter/jsgi/transporter"], function(require){
	Transporter = require("transporter/jsgi/transporter").Transporter;
	//require.reloadable(function(){
							// this will provide access to the server side JS libraries from the client
		pinturaApp = //Transporter({loader: require("nodules").forEngine("browser").useLocal().getModuleSource},
			// the main app
			require("pintura/pintura").app;
		require("./app");
	//});
//	require("tunguska/jack-connector").observe("worker", pinturaApp.addConnection);
	// we start the REPL (the interactive JS console) because it is really helpful

if(require.main == module){
    var server = new (require("ringo/httpserver").Server)({appName: "app", appModule: module.id});
    server.getContext("/public").serveStatic("public");
    server.getContext("/packages").serveStatic("C:/packages");
    server.start();
}
	
//});
	

var perseverePath;/*, 
	Static = require("jack/lib/jack/static").Static,
	Directory = require("jack/lib/jack/dir").Directory;*/
	
var path = require.paths[0].match(/(.*?)[\/\\]packages[\/\\]/);
if(path){
	perseverePath = path[1] + "/packages/persevere/public";
}

// now setup the development environment, handle static files before reloading the app
// for better performance
//exports.app = exports.development = function(app, options){
	// make the root url redirect to /Page/Root  
	//require("./jsgi/redirect-root").RedirectRoot(require("jack/lib/jack/redirect").Redirect, 
exports.app = 
			// cascade from static to pintura REST handling
/*		// this will provide module wrapping for the Dojo modules for the client
		transporter.Transporter({
			urlPrefix:"/js/",
			paths:["../../persevere/public/js/"],
			converter: transporter.Dojo
		}),*/
		// the main place for static files accessible from the web
		//require('ringo/middleware/static').middleware(module.resolve('public')),
		//Directory("public", Static(null, {urls:[""], root: "public"})),
		//Static(null, {urls:["/explorer"], root: perseverePath + "/explorer"}),
	 	// main Pintura handler 
		function(request){
			print("request" + request);
			return pinturaApp(request);
		}
		;

