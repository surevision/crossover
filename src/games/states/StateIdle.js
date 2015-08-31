// 待机状态
var StateIdle = StateBase.extend({
	ctor : function() {
		this._super(CharacterState.IDLE);
	},
	onEnter : function(character) {
		this._super(character);
		character.speed_x = 0;
	},
});