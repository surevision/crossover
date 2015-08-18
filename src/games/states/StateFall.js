var StateFall = StateBase.extend({
	ctor : function() {
		this._super(CharacterState.FALL);
	},
	onExecute : function(character) {
		this._super(character);
		character.speed_y -= GRAVITY;
	}
})