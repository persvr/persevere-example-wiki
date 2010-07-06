var defaultLoader = require.loader;
var packages = ["perstore", "pintura", "commonjs-utils", "wiky", "transporter", "narwhal-lib", "narwhal", "tunguska", "promised-io", "rql", "patr"];
var remapped = {
	fs: "../engines/rhino/lib/fs",
	"http-client": "../engines/rhino/lib/http-client",
}
var packageRemapped = {
	"narwhal-lib": "narwhal"
}
try{
	require("perstore/model");
}catch(e){
	var defaultResolvePkg = require.loader.resolvePkg;
	require.loader.resolvePkg = function(id, baseId, pkg, basePkg){
		var packageName;
		for(var i = 0; i < packages.length; i++){
			packageName = packages[i];
			if(id.substring(0, packageName.length) == packageName){
				var id = id.substring(packageName.length + 1);
				if(id in remapped){
					id = remapped[id];
				}
				if(packageName in packageRemapped){
					packageName = packageRemapped[packageName];
				}
				return defaultResolvePkg(id, baseId, packageName, basePkg);
			}
		}
		return defaultResolvePkg(id, baseId, pkg, basePkg);
	};
}
