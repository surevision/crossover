// 场景基类
var SceneBase = cc.Scene.extend({
	ctor : function() {
		this._super();
		this.size = cc.director.getWinSize();
	},
	onEnter:function () {
		this._super();
		this.start();
		this.scheduleUpdate();
	},
	onExit : function() {
		this._super();
		this.unscheduleUpdate();
		this.terminate();
	},
	update : function(dt) {
		Input.update(dt);
		this.updateLogic(dt);
	},
	updateLogic : function(dt) {

	},
	start : function() {
	},
	terminate : function() {
	}
});