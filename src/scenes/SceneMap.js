var SceneMap = SceneBase.extend({	
	ctor : function() {
		this._super();
		this.armatures = [];

	},
	start : function() {      
		this._super();
		var map = new GameMap();
		map.setup(1);
		this.addChild(map.tmx);
		map.isPassable(0, 11);

		var armature = new ArmatureCharacter(new GameCharacter("TuanZi"), this);
		armature.character.y = 100;
		this.armatures.push(armature);
	},
	updateLogic : function(dt) {
		this._super();
		for (var i = 0; i < this.armatures.length; i += 1) {
			this.armatures[i].update();
		}
	}
});