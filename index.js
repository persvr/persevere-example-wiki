// helpful for debugging
var pinturaApp,
	settings = require("commonjs-utils/settings"),
	Static = require("pintura/jsgi/static").Static,
	start = require("pintura/start-node").start,
	multiNode = require("multi-node/multi-node");
function setPinturaApp(){
	pinturaApp = require("pintura/pintura").app;
	require("./app");
}
require.reloadable ? require.reloadable(setPinturaApp) : setPinturaApp();
start(
	// uncomment this to enable compression with node-compress
	//require("pintura/jsgi/compress").Compress(
	// make the root url redirect to /Page/Root  
	require("./jsgi/redirect-root").RedirectRoot(
		require("pintura/jsgi/cascade").Cascade([ 
		// cascade from static to pintura REST handling
			// the main place for static files accessible from the web
			Static({urls:["/public"], root: "public", directoryListing: true}),
			Static({urls:["/packages"], root: "/c/packages", directoryListing: true}),
			Static({urls:["/explorer"], root: require("nodules").getCachePath("persevere-client/") + "/explorer"}),
			// this will provide access to the server side JS libraries from the client
			require("transporter/jsgi/transporter").Transporter({
				loader: require("nodules").forBrowser().useLocal().getModuleSource}),
				// main pintura app
				function(request){
					return pinturaApp(request);
				}
		])
	)
//)
);

// this is just to ensure the static analysis preloads the explorer package
false&&require("persevere-client/explorer/explorer.js"); 
