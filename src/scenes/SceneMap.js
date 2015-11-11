var SceneMap = SceneBase.extend({	
	ctor : function() {
		this._super();
		this.armatures = [];
		this.map = null;

	},
	start : function() {      
		this._super();
		var map = new GameMap();
		this.map = map;
		map.setup(1);
		this.addChild(map.tmx);

		var armature = new ArmatureCharacter(new GameCharacter("TuanZi"), this);
		armature.character.real_y = 5 * 32;
		this.armatures.push(armature);
	},
	updateLogic : function(dt) {
		this._super();
		for (var i = 0; i < this.armatures.length; i += 1) {
			this.armatures[i].update();
		}
	}
});