// 落地
var StateFall = StateBase.extend({
	ctor : function() {
		this._super(CharacterState.FALL);
	},
	onEnter : function(character) {
		this._super(character);
		character.speed_y = 0;
	}
})