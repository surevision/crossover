// GameCharacter 地图行走物件（玩家、事件）数据
var GameCharacter = cc.Class.extend({
	ctor : function(characterArmatureName) {
		this.characterArmatureName = characterArmatureName || "";	// 动画名
		this.x = 0;														// 地图 X 坐标
		this.y = 0;														// 地图 Y 坐标
		this.real_x = 0;													// 地图实际X坐标
		this.real_y = 0;													// 地图实际Y坐标
		this.last_real_x = 0;												// 上次x，隧穿检测
		this.last_real_y = 0;												// 上次y，隧穿检测
		this.screen_x = 0;												// 屏幕X坐标
		this.screen_y = 0;												// 屏幕Y坐标
		this.speed_x = 0;												// 水平速度，松开按键时立刻归零
		this.speed_y = 0;												// 垂直速度，逐帧减少至0
		this.dir = true;												// 水平方向(true 右 false 左)
		this.render_width = 0;											// 渲染宽度(可从sprite传入)
		this.render_height = 0;											// 渲染高度(可从sprite传入)
		this.stateMachineX = new GameCharacterStateMachine(this);	// 水平方向状态机
		this.stateMachineY = new GameCharacterStateMachine(this);	// 垂直方向状态机
	},
	isInState : function(stateId) {
		var stateX = this.stateMachineX.currState;
		var stateY = this.stateMachineY.currState;
		return (stateX && stateX.id == stateId) ||
				(stateY && stateY.id == stateId);
	},
	/** 跳跃 
	* withoutSpeed : true 初速0自由落体进入跳跃状态，如平移中在悬崖边掉落
	*/
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
		if (this.isInState(CharacterState.MOVE)) {
			// 设置位置
			this.real_x += this.speed_x * (this.dir ? 1 : -1);
		}
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
		this.last_real_y = this.real_y; // 暂时只需要记录y
		if (this.isInState(CharacterState.JUMP)) {
			// 隧穿记录
			// 设置位置
			this.real_y -= this.speed_y;
		}
		// 检查落地、撞墙等状态
		this.checkState();
		// 检查事件碰撞
		this.checkEvent();
		// 调整设置屏幕位置
		this.adjustPos();
	},
	checkState : function() {
		// 落地-掉落-待机		
		var map = SceneManager.runningScene.map;
		var checkX = parseInt(this.real_x / 32);
		var checkY = parseInt(this.real_y / 32) - 1;
		var checkLY = parseInt(this.last_real_y / 32) - 1;
		cc.log("%d %d %d", checkX, checkY, checkLY);
		var dirX = parseInt((this.real_x + (this.dir ? 1 : -1) * 32) / 32);
		if (!map.isPassable(dirX, checkY)) {
			this.idle();
		}
		if (this.isInState(CharacterState.JUMP)) {
			if (this.speed_y < 0) {
				// 向下掉落
				var downY = (checkY + 1) * 32; // 平地高度
				// 当前方块是斜坡
				if (map.isSlope(checkX, checkY)) {
					downY += map.slopeY(this.real_x, checkY * 32);
				}
				// 下方方块是斜坡
				if (map.isSlope(checkX, checkY + 1)) {
					downY += map.slopeY(this.real_x, (checkY + 1) * 32);
				}
				if (this.real_y > downY && !map.isPassable(checkX, checkY + 1)) {
					this.fall();
					this.real_y = downY;
				}
			}
		} else {
			// 移动中
			if (map.isPassable(checkX, checkY + 1) && !map.isSlope(checkX, checkY + 1)) {
				// 脚下是空地
				cc.log("脚下是空地", checkX, checkY + 1);
				this.jump(true);
				// return;
			}
			var downY = (checkY + 1) * 32; // 平地高度
			if (map.isSlope(checkX, checkY)) {
				// 当前方块是斜坡（在斜坡上行走）
				downY -= map.slopeY(this.real_x, checkY * 32);
				this.real_y = downY;
			} else if (map.isSlope(checkX, checkY + 1)) {
				// 脚下方块是斜坡（掉落到斜坡上）
				downY += 32 - map.slopeY(this.real_x, (checkY + 1) * 32);
				this.real_y = downY;
			}
			if (!map.isPassable(checkX, checkY + 1)) {
				this.fall();
			}
		}

	},
	checkEvent : function() {
		for (var i = 0; i < SceneManager.runningScene.map.events.length; i += 1) {
			var e = SceneManager.runningScene.map.events[i];
			var x = parseInt(e.x) / Map.TILE_WIDTH;
			var y = parseInt(e.y) / Map.TILE_HEIGHT;
			var w = parseInt(e.width);
			var h = parseInt(e.height);
			// console.log(e.name, e.x, e.y, x, y, this.x, this.y);
			if (x == this.x && y == this.y) {
				// console.log(e);
				if (e[eEvent.toEval]) {
					eval(e[eEvent.toEval]);
				}
			}
		}
	},
	adjustPos : function() {
		this.x = parseInt(this.real_x / 32);
		this.y = parseInt((this.real_y) / 32);
		if (SceneManager.runningScene.map.isSlope(this.x, this.y)) {
			this.y += 1;
		}
		if (this.y <= 0) {
			// gameover
			// SceneManager.call(new SceneTitle());
		}
	},
	adjustSlope : function() {
		var slopeY =  SceneManager.runningScene.map.slopeY(this.real_x, this.real_y);
		return slopeY;
	}
});