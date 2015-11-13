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
		if (this.isInState(CharacterState.JUMP)) {
			// 隧穿记录
			this.last_real_y = this.real_y; // 暂时只需要记录y
			// 设置位置
			this.real_y += this.speed_y;
			var checkLY = parseInt(this.last_real_y / 32);
			var checkY = parseInt(this.real_y / 32);

			console.log("last_y, real_y , diff , cly, cy: %d, %d, %d", this.last_real_y, this.real_y, this.last_real_y - this.real_y, checkLY, checkY);
		}
		if (this.isInState(CharacterState.MOVE)) {
			// 设置位置
			this.real_x += this.speed_x * (this.dir ? 1 : -1);
		}
		// 检查落地、撞墙等状态
		this.checkState();
		// 调整设置屏幕位置
		this.adjustPos();
	},
	checkState : function() {
		// 落地-掉落-待机		
		var checkX = parseInt(this.real_x / 32);
		var checkY = parseInt(this.real_y / 32);
		var checkLY = parseInt(this.last_real_y / 32);
		if (this.isInState(CharacterState.JUMP)) {
			// 落地
			var _x = checkX;
			var _y = SceneManager.runningScene.map.height() - checkY;
			// 只需判定向下运动时的隧穿。
			if (checkLY - checkY < 1) {
				if (this.speed_y < 0 && (!SceneManager.runningScene.map.isPassable(_x, _y))) {
					if (this.real_y > checkY * 32 - this.render_height / 2 && 
							this.real_y < checkY * 32 + this.render_height / 2) {
						this.fall();
						checkY = parseInt(this.real_y / 32);
						this.real_y = checkY * 32;
						console.log("落地: checkY %d, _y %d", checkY, _y);
					}
				}
			} else {
				console.log("隧穿！");
				// 两次运动超过1格，逐格检测
				var cnt = checkLY - checkY;
				for (var i = 0; i < cnt; i += 1) {
					checkY = checkY + 1;
					_y = SceneManager.runningScene.map.height() - checkY;
					console.log("隧穿递推 _y: %d", _y);
					if (this.speed_y < 0 && (!SceneManager.runningScene.map.isPassable(_x, _y))) {
						if (this.real_y > checkY * 32 - this.render_height / 2 && 
								this.real_y < checkY * 32 + this.render_height / 2) {
							this.fall();
							this.real_y = checkY * 32;
							console.log("落地隧穿: checkY %d, _y %d", checkY, _y);
							break;
						}
					}
				}
			}
		}
		if (this.speed_y == 0) {
			// 掉落(初速为0自由落体)
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
			if (_x >= SceneManager.runningScene.map.width() || 
				_x < 0 ||
				!SceneManager.runningScene.map.isPassable(_x, _y)) {
				if (this.dir) {
					// 向右					
					if (this.real_x >= _x * 32 - this.render_width / 2) {
						console.log("撞墙右 %d %d", _x, _y);
						this.idle();
					}
				} else {
					if (this.real_x <= (_x + 1) * 32 + this.render_width / 2) {
						console.log("撞墙左 %d %d", _x, _y);
						this.idle();
					}
				}
				console.log("idle _x, _y, real_x, speed_x %d", _x, _y, this.real_x, this.speed_x);
			}
		}
	},
	adjustPos : function() {
		this.x = parseInt(this.real_x / 32);
		this.y = parseInt(this.real_y / 32);
		// todo:暂时相同
		// this.screen_x = this.real_x;
		// this.screen_y = this.real_y;
	
		if (this.y <= 0) {
			// gameover
			SceneManager.call(new SceneTitle());
		}
	}
});