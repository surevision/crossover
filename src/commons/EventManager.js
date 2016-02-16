var EventManager = {
	/**
	* 全局停止响应事件dt时间
	**/
	sleepUI : function(dt) {
		cc.eventManager.setEnabled(false);
		this.runAction(cc.sequence(cc.delayTime(dt),
                cc.callFunc(this.wakeUpUI, this)));
	},
	/**
	* 全局停止响应事件
	**/
	freezeUI : function() {
		cc.eventManager.setEnabled(false);
	},
	/**
	* 全局恢复响应事件
	**/
	wakeUpUI : function() {
		cc.eventManager.setEnabled(true);
	}
};