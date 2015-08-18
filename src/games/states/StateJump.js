var StateJump = StateBase.extend({
	ctor : function() {
		this._super(CharacterState.JUMP);
	},
	onEnter : function(character) {
		this._super(character);
		character.speed_y = SPEED_JUMP;
	},
	onExecute : function(character) {
		this._super(character);
		character.speed_y -= GRAVITY;
	}
})