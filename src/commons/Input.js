
var KeyEvent = cc.Class.extends({
	ctor : function(code, keyEvent) {
		this.code = code;
		this.keyEvent = keyEvent;
	}
})
var Input = {
	// 按下的key的状态(code=>按下的帧数)
	status : {},
	// 发生事件的key(down，up)，被事件监听者修改
	events : [],
	// 更新按键状态
	update : function(dt) {
		// 更新已按下的key的持续时间
		var currKeys = [];
		var code = null;
		for (code in Input.status) {
			Input.status[code] += 1;
			currKeys.push(code);
		}
		if (currKeys.length > 0) {
			console.log("currKeys %s", currKeys.join(","));
		}		
		var event = null;
		while (event = Input.events.shift()) {
			if (event.keyEvent == KeyEvent.DOWN) {
				// 新键按下
				var code = event.keyEvent.code;
				Input.status[code] = 0;
			} else if (event.keyEvent == KeyEvent.UP) {
				Input.status[code] = null;
			}
		}
	},
	// 判断是否按下
	isPress : function(code) {
		return Input.status[code];
	},
	// 判断短按,刚刚按下的状态
	isTrigger : function(code) {
		return Input.status[code] && Input.status[code] == 0;
	}
	// 2方向移动状态
	dir2 : function() {
		if (Input.status[Keys.LEFT]) {
			return 4;
		} else if (Input.status[Keys.RIGHT]) {
			return 6;
		}
		return 0;
	},
	// 4方向移动状态
	dir4 : function() {
		if (Input.status[Keys.DOWN]) {
			return 2;
		} else if (Input.status[Keys.LEFT]) {
			return 4;
		} else if (Input.status[Keys.RIGHT]) {
			return 6;
		} else if (Input.status[Keys.UP]) {
			return 8;
		}
		return 0;
	},
	// 8方向移动状态
	dir8 : function() {
		// 先判定组合键的情况
		if (Input.status[Keys.DOWN] && Input.status[Keys.LEFT]) {
			return 1;
		} else if (Input.status[Keys.DOWN] && Input.status[Keys.RIGHT]) {
			return 3;
		} else if (Input.status[Keys.DOWN]) {
			return 2;
		} else if (Input.status[Keys.UP] && Input.status[Keys.LEFT]) {
			return 7;
		} else if (Input.status[Keys.UP] && Input.status[Keys.RIGHT]) {
			return 9;
		} else if (Input.status[Keys.UP]) {
			return 8;
		} else if (Input.status[Keys.LEFT]) {
			return 4;
		} else if (Input.status[Keys.RIGHT]) {
			return 6;
		}
		return 0;
	},
};