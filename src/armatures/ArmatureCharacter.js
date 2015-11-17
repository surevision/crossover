var ArmatureCharacter = ArmatureBase.extend({
	ctor : function(character, node) {
		this._super(character.characterArmatureName, node);
		this.character = character;
 		this.lastStateId = null;
 		this.tmxMap = node;
		this.init(this.tmxMap);
		// this.debug(true);
	},
	init : function(tmxMap) {
		this.armature.setPosition(this.character.screen_x, this.character.screen_y);
		this.tmxMap.reorderChild(this.armature, DEFAULT_CHARACTER_LAYER);
		this.checkState();
	},
	update : function() {
		this._super();
		this.character.render_width = this.armature.getBoundingBox().width
		this.character.render_height = this.armature.getBoundingBox().height
		this.character.update();
		this.checkState();
		this.armature.setPosition(this.character.screen_x, this.character.screen_y);
		this.armature.setScaleX(this.character.dir ? -1 : 1);
	},
	// 检查动作状态，播放响应动作
	checkState : function() {
		// 跳跃 => 移动 => 静止
		var stateId = null;
		if (this.character.isInState(CharacterState.JUMP)) {
			stateId = CharacterState.JUMP;
		} else if (this.character.isInState(CharacterState.MOVE)) {
			stateId = CharacterState.MOVE;
		} else {
			stateId = CharacterState.IDLE;
		}
		if (stateId && stateId != this.lastStateId) {
			this.lastStateId = stateId;
			if (stateId == CharacterState.JUMP) {
				this.play(ACM.JUMP);
			} else if (stateId == CharacterState.MOVE) {
				this.play(ACM.MOVE);
			} else if (stateId == CharacterState.IDLE) {
				this.play(ACM.IDLE);
			}
		}
	}
});