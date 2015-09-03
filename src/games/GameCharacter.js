// GameCharacter 地图行走物件（玩家、事件）数据
var GameCharacter = cc.Class.extend({
	ctor : function(characterArmatureName) {
		this.characterArmatureName = characterArmatureName || "";	// 动画名
		this.x = 0;														// 地图 X 坐标
		this.y = 0;														// 地图 Y 坐标
		this.real_x = 0;													// 地图实际X坐标
		this.real_y = 0;													// 地图实际Y坐标
		this.screen_x = 0;												// 屏幕X坐标
		this.screen_y = 0;												// 屏幕Y坐标
		this.speed_x = 0;												// 水平速度，松开按键时立刻归零
		this.speed_y = 0;												// 垂直速度，逐帧减少至0
		this.dir = true													// 水平方向(true 右 false 左)
		this.stateMachineX = new GameCharacterStateMachine(this);	// 水平方向状态机
		this.stateMachineY = new GameCharacterStateMachine(this);	// 垂直方向状态机
	},
	isInState : function(stateId) {
		var stateX = this.stateMachineX.currState;
		var stateY = this.stateMachineY.currState;
		return (stateX && stateX.id == stateId) ||
				(stateY && stateY.id == stateId);
	},
	// 跳跃
	jump : function(withoutSpeed) {
		this.stateMachineY.changeState(new StateJump(withoutSpeed));
	},
	// 落地，纵向静止
	fall : function() {
		this.stateMachineY.changeState(new StateFall());
	},
	// 行走
	move : function(dir) {
		// 速度随方向同时剧变
		this.stateMachineX.changeState(new StateMove());
		this.dir = !!dir;
	},
	// 待机，横向静止
	idle : function() {
		this.stateMachineX.changeState(new StateIdle());
	},
	// 刷新
	update : function() {
		this.stateMachineX.update();
		this.stateMachineY.update();
		switch (Input.dir2()) {
			case 4 :
				console.log("LEFT");
				this.move();
			break;
			case 6 :
				console.log("RIGHT");
				this.move(true);
			break;
			default :
				this.idle();
			break;
		}
		if (Input.isTrigger(Keys.UP) && (!this.isInState(CharacterState.JUMP))) {
			this.jump();
		}
		// 检查落地、撞墙等状态
		this.checkState();
		if (this.isInState(CharacterState.JUMP) || this.isInState(CharacterState.MOVE)) {
			// 设置位置
			this.real_x += this.speed_x * (this.dir ? 1 : -1);
			this.real_y += this.speed_y;			
		}
		// 调整设置屏幕位置
		this.adjustPos();
	},
	checkState : function() {
		// 落地-掉落-待机		
		var checkX = parseInt(this.real_x / 32);
		var checkY = parseInt(this.real_y / 32);
		if (this.isInState(CharacterState.JUMP)) {
			// 落地
			var _x = checkX;
			var _y = SceneManager.runningScene.map.height() - checkY;
			if (this.speed_y < 0 && (!SceneManager.runningScene.map.isPassable(_x, _y))) {
				if (this.real_y > checkY * 32 - 10 && this.real_y < checkY * 32 + 10) {
					this.fall();
					this.real_y = checkY * 32;
					checkY = parseInt(this.real_y / 32);					
				}
			}
		}
		if (this.speed_y == 0) {
			// 掉落
			var _x = this.x;
			var _y = SceneManager.runningScene.map.height() - checkY;
			if (SceneManager.runningScene.map.isPassable(_x, _y)) {
				this.jump(true);
			}
		}
		if (this.isInState(CharacterState.MOVE)) {
			// 撞墙
			var _x = this.x + 1 * (this.dir ? 1 : -1);
			var _y = SceneManager.runningScene.map.height() - checkY - 1;
			if (!SceneManager.runningScene.map.isPassable(_x, _y)) {
				if (this.real_x > _x * 32 - 5 && this.real_x < _x * 32 + 5) {
					console.log("撞墙 %d %d", _x, _y);
					this.idle();			
				}
			}
		}
	},
	adjustPos : function() {
		this.x = parseInt(this.real_x / 32);
		this.y = parseInt(this.real_y / 32);
		// todo:暂时相同
		this.screen_x = this.real_x;
		this.screen_y = this.real_y;

		if (this.y < -2) {
			// gameover
			SceneManager.call(new SceneTitle());
		}
	}
});