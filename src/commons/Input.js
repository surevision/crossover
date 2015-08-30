
var KeyEvent = cc.Class.extend({
	// code : Keys码, keyEventType : KeyEventTypes码(按下、松开)
	ctor : function(code, keyEventType) {
		this.code = code;
		this.keyEventType = keyEventType;
	}
});
var Input = {
	// 按下的key的状态(code=>按下的帧数)
	status : {},
	// 发生事件的key(down，up)，被事件监听者修改
	events : [],
	// 更新按键状态
	update : function(dt) {
		// 更新已按下的key的持续时间
		var currKeys = {
			codes : [],
			num : []
		};
		var code = null;
		for (code in Input.status) {
			if (Input.status[code]) {
				Input.status[code] += 1;
				currKeys.codes.push(code);
				currKeys.num.push(Input.status[code]);
			}
		}
		var event = null;
		while (event = Input.events.shift()) {
			if (event.keyEventType == KeyEventTypes.DOWN) {
				console.log("key down %s", event.code);
				var code = event.code;
				Input.status[code] = Input.status[code] || 1;
			} else if (event.keyEventType == KeyEventTypes.UP) {
				console.log("key up %s", event.code);
				var code = event.code;
				Input.status[code] = null;
			}
		}
	},
	// 判断是否按下
	isPress : function(code) {
		return !!Input.status[code];
	},
	// 判断短按,刚刚按下的状态
	isTrigger : function(code) {
		return !!(Input.status[code] && (Input.status[code] == 1));
	},
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