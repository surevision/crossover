var res = {
	HelloWorld : "res/HelloWorld.png",

	tilesets : [
		"res/maps/kenney_16x16.png",
	],
	tilemaps : [
		"res/maps/map1.tmx",
	]

}

var preloads = []

function pushPreloads(preloads, materials) {
	for (var i = 0; i < materials.length; i += 1) {
		preloads.push(materials[i]);
	}
}

pushPreloads(preloads, [res.HelloWorld]);
pushPreloads(preloads, res.tilesets);
pushPreloads(preloads, res.tilemaps);

console.log(preloads);