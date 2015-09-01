var ArmatureCharacter = ArmatureBase.extend({
	ctor : function(character, node) {
		this._super(character.characterArmatureName, node);
		this.character = character;
 		this.lastStateId = null;
		this.init();
	},
	init : function() {
		this.armature.setPosition(this.character.screen_x, this.character.screen_y);
		this.checkState();
	},
	update : function() {
		this._super();
		this.character.update();
		this.checkState();
		this.armature.setPosition(this.character.screen_x, this.character.screen_y);
		this.armature.setScaleX(this.character.dir ? -1 : 1);
	},
	// 检查动作状态，播放响应动作
	checkState : function() {
		// 跳跃 => 移动 => 静止
		var stateId = null;
		if (this.character.stateMachineY.currState) {
			if (this.character.stateMachineY.currState.id == CharacterState.JUMP) {
				stateId = CharacterState.JUMP;
			}
		}
		if (this.character.stateMachineX.currState) {
			if (!stateId && this.character.stateMachineX.currState.id == CharacterState.MOVE) {
				stateId = CharacterState.MOVE;
			}
		}
		if (!stateId) {
			stateId = CharacterState.IDLE;
		}
		if (stateId && stateId != this.lastStateId) {
			this.lastStateId = stateId;
			if (this.character.isInState(CharacterState.JUMP)) {
				this.play(ACM.JUMP);
			} else if (this.character.isInState(CharacterState.IDLE)) {
				this.play(ACM.IDLE);
			} else if (this.character.isInState(CharacterState.MOVE)) {
				this.play(ACM.MOVE);
			}
		}
	}
});