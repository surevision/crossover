// GameCharacter 地图行走物件（玩家、事件）数据
var GameCharacter = cc.Class.extend({
	ctor : function(characterArmatureName) {
		this.characterArmatureName = characterArmatureName || "";	// 动画名
		this.x = 0;														// 地图 X 坐标，屏幕坐标另算
		this.y = 0;														// 地图 Y 坐标，屏幕坐标另算
		this.speed_x = 0;												// 水平速度，松开按键时立刻归零
		this.speed_y = 0;												// 垂直速度，逐帧减少至0
		this.dir = true													// 水平方向(true 右 false 左)
		this.state = null;													// 状态
		GameCharacterStateMachine.changeState(this, new StateIdle());
	},
	isInState : function(stateId) {
		return this.state && this.state.id == stateId;
	},
	// 跳跃，与掉落互斥
	jump : function() {
		GameCharacterStateMachine.changeState(this, new StateJump());
	},
	// 掉落， 与跳跃互斥
	fall : function() {
		GameCharacterStateMachine.changeState(this, new StateFall());
	},
	// 行走
	move : function(dir) {
		// 速度随方向同时剧变
		GameCharacterStateMachine.changeState(this, new StateMove());
		this.dir = !!dir;
	},
	// 待机，横向静止
	idle : function() {
		GameCharacterStateMachine.changeState(this, new StateIdle());
	},
	// 刷新
	update : function() {
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
		this.y += this.speed_y;
		this.x += this.speed_x * (this.dir ? 1 : -1);
	}
});