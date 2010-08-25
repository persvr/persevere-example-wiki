// helpful for debugging

print = require("promised-io/process").print;
var pinturaApp,
	settings = require("commonjs-utils/settings"),
	Static = require("pintura/jsgi/static").Static,
	multiNode = require("multi-node/multi-node");

require.reloadable(function(){
	pinturaApp = require("pintura/pintura").app;
});

var nodes = multiNode.listen({port: settings.port || 8080, nodes: settings.processes || 1}, 
	require( "http" ).createServer(
		require("jsgi-node").Listener(
			// uncomment this to enable compression with node-compress
			//require("pintura/jsgi/compress").Compress(
			require("./jsgi/redirect-root").RedirectRoot(
				require("pintura/jsgi/cascade").Cascade([ 
				// cascade from static to pintura REST handling
					// the main place for static files accessible from the web
					Static({urls:[""], root: "public", directoryListing: true}),
					Static({urls:["/explorer"], root: require("nodules").getCachePath("persevere-client/") + "/explorer"}),
					// this will provide access to the server side JS libraries from the client
					require("transporter/jsgi/transporter").Transporter({
						loader: require("nodules").forEngine("browser").useLocal().getModuleSource}),
					// make the root url redirect to /Page/Root  
						// main pintura app
						function(request){
							return pinturaApp(request);
						}
				])
			)
		//)
		)
	)
);

nodes.addListener("node", function(stream){
	pinturaApp.addConnection(multiNode.frameStream(stream));
});

// having a REPL is really helpful
if(nodes.isMaster){
	require("pintura/util/repl").start();
}

// this is just to ensure the static analysis preloads the explorer package
false&&require("persevere-client/explorer/explorer.js"); 
