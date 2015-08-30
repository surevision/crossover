var SceneMap = SceneBase.extend({	
	ctor : function() {
		this._super();

	},
	start : function() {      
		this._super();
		var map = new GameMap();
		map.setup(1);
		this.addChild(map.tmx);
		map.isPassable(0, 11);
	},
	updateLogic : function(dt) {
		this._super();
	}
});