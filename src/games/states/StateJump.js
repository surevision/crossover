// 跳跃
var StateJump = StateBase.extend({
	ctor : function(withoutSpeed) {
		this._super(CharacterState.JUMP);
		this.withoutSpeed = withoutSpeed;
	},
	onEnter : function(character) {
		this._super(character);
		if (!this.withoutSpeed) {
			character.speed_y = SPEED_JUMP;			
		}
	},
	onExecute : function(character) {
		this._super(character);
		character.speed_y -= GRAVITY;
	}
});