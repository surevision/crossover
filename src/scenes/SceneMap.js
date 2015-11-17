var SceneMap = SceneBase.extend({	
	ctor : function() {
		this._super();
		this.armatures = [];
		this.map = null;
		this.player = null;
	},
	start : function() {      
		this._super();
		var map = new GameMap();
		this.map = map;
		map.setup(1);
		this.addChild(map.tmx);

		this.player = new GameCharacter("TuanZi");
		var armature = new ArmatureCharacter(this.player, this.map.tmx);
		armature.character.real_y = 10 * 32;
		this.armatures.push(armature);
	},
	updateLogic : function(dt) {
		this._super();
		this.map.centerPlayer();
		for (var i = 0; i < this.armatures.length; i += 1) {
			this.armatures[i].update();
		}
	}
});