var StateMove = StateBase.extend({
	ctor : function() {
		this._super(CharacterState.MOVE);
	},
	onEnter : function(character) {
		this._super(character);
		character.speed_x = SPEED_MOVE;
	}
})