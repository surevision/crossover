// 状态基类
var StateBase = cc.Class.extend({
	ctor : function(id) {
		this.id = id;
	},
	onEnter : function(character) {},
	onExecute : function(character) {},
	onExit : function(character) {}
});