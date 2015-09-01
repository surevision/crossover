var ArmatureBase = cc.Class.extend({
	ctor : function(name, node) {	
		var jsonFilename = ArmaturePathPre + name + "/" + name + ".ExportJson";
		console.log(jsonFilename);
		ccs.armatureDataManager.addArmatureFileInfo(jsonFilename);
		var armature = ccs.Armature.create(name);
		if (node) {
			node.addChild(armature);
		}		
		this.armature = armature;
		this.name = name;
	},
	update : function() {	},
	dispose : function() {
		this.armature.removeFromParent();
	},
	play : function(movement) {
		this.armature.getAnimation().play(movement);
	}
});