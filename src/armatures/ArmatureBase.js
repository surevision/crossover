var ArmatureBase = cc.Class.extend({
	ctor : function(name, node) {	
		var jsonFilename = ArmaturePathPre + name + "/" + name + ".ExportJson";
		console.log(jsonFilename);
		ccs.armatureDataManager.addArmatureFileInfo(jsonFilename);
		var armature = ccs.Armature.create(name);
		node.addChild(armature);
		this.armature = armature;
		this.name = name;

		// debug
		this._debug = false;
        this.drawNode = new cc.DrawNode();
        this.drawNode.setDrawColor(cc.color(100,100,100,255));
        this.armature.getParent().addChild(this.drawNode);
	},
	update : function() {

		// debug
		if (this._debug) {
			var rect =  this.armature.getBoundingBox();
			this.drawNode.clear();
			this.drawNode.drawRect(cc.p(rect.x, rect.y), cc.p(cc.rectGetMaxX(rect), cc.rectGetMaxY(rect)));
		}
	},
	dispose : function() {
		this.armature.removeFromParent();

		// debug
		this.drawNode.removeFromParent();
	},
	play : function(movement) {
		this.armature.getAnimation().play(movement);
	},

	//debug
	debug : function(_debug) {
		this._debug = _debug;
	}

});