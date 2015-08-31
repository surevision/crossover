var res = {
	HelloWorld : ["res/HelloWorld.png"],

	tilesets : [
		"res/maps/kenney_16x16.png",
	],
	tilemaps : [
		"res/maps/map1.tmx",
	],
	armatures : [
		"res/armatures/TuanZi/TuanZi.ExportJson",
		"res/armatures/TuanZi/TuanZi0.plist",
		"res/armatures/TuanZi/TuanZi0.png",
	]
}

var preloads = [];

function pushPreloads(preloads, materials) {
	for (var i = 0; i < materials.length; i += 1) {
		preloads.push(materials[i]);
	}
}

pushPreloads(preloads, res.HelloWorld);
pushPreloads(preloads, res.tilesets);
pushPreloads(preloads, res.tilemaps);
pushPreloads(preloads, res.armatures);

console.log("res :");
console.log(preloads);