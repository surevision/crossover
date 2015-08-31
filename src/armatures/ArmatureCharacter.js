var ArmatureCharacter = ArmatureBase.extend({
	ctor : function(character, node) {
		this._super(character.characterArmatureName, node);
		this.character = character;
 		this.lastStateId = null;
		this.init();
	},
	init : function() {
		this.armature.setPosition(this.character.x, this.character.y);
		this.checkState();
	},
	update : function() {
		this._super();
		this.character.update();
		this.checkState();
		this.armature.setPosition(this.character.x, this.character.y);
		this.armature.setScaleX(this.character.dir ? -1 : 1);
	},
	// 检查动作状态，播放响应动作
	checkState : function() {
		if (this.character.state && this.character.state.id != this.lastStateId) {
			this.lastStateId = this.character.state.id;
			if (this.character.isInState(CharacterState.IDLE)) {
				this.play(ACM.IDLE);
			} else if (this.character.isInState(CharacterState.MOVE)) {
				this.play(ACM.MOVE);
			} else if (this.character.isInState(CharacterState.JUMP)) {
				this.play(ACM.JUMP);
			} else if (this.character.isInState(CharacterState.FALL)) {
				this.play(ACM.JUMP);
			}
		}
	},
	play : function(movement) {
		this.armature.getAnimation().play(movement);
	}
});