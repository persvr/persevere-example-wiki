var pinturaApp,
	settings = require("commonjs-utils/settings"),
	multiNode = require("multi-node/multi-node");

require.reloadable(function(){
	pinturaApp = require("pintura/pintura").app;
	require("app");
});

var nodes = multiNode.listen({port: settings.port || 8080, nodes: settings.processes || 1}, 
	require( "http" ).createServer(
		require("jsgi-node").Listener(
			// uncomment this to enable compression with node-compress
			//require("pintura/jsgi/compress").Compress(
				require("pintura/jsgi/cascade").Cascade([ 
				// cascade from static to pintura REST handling
					// the main place for static files accessible from the web
					require("pintura/jsgi/static").Static({urls:[""],roots:["public"]}),
					require("pintura/jsgi/static").Static({urls:["/explorer"],roots:[require("nodules").getCachePath("persevere-client/")]}),
					require("pintura/jsgi/static").Static({urls:["/js/dojo-persevere"],roots:[require("nodules").getCachePath("persevere-client/")]}),
					// this will provide access to the server side JS libraries from the client
					require("transporter/jsgi/transporter").Transporter({
						loader: require("nodules").forEngine("browser").useLocal().getModuleSource}),
					// make the root url redirect to /Page/Root  
					require("./jsgi/redirect-root").RedirectRoot(
						// main pintura app
						function(request){
							return pinturaApp(request);
						}
					)
				])
			)
		//)
	)
);

nodes.addListener("node", function(stream){
	pinturaApp.addConnection(multiNode.frameStream(stream));
});

// having a REPL is really helpful
if(nodes.isMaster){
	try{
		var stdin = process.openStdin();
		stdin.addListener("close", process.exit);
		require("repl").start("node>", stdin).scope.require = require;
	}catch(e){
		require("sys").puts("Could not start repl: " + e);
	}
};

// this is just to ensure the static analysis preloads the explorer package
false&&require("persevere-client/explorer/explorer.js"); 
