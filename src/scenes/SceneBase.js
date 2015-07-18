// 场景基类
var SceneBase = cc.Scene.extend({
    ctor : function() {
        this._super();
    },
    onEnter:function () {
        this._super();
        this.start();
        this.scheduleUpdate();
    },
    onExit : function() {
        this._super();
        this.unscheduleUpdate();
        this.terminate();
    },
    update : function(dt) {
        this.updateLogic(dt);
    },
    updateLogic : function(dt) {

    },
    start : function() {
    },
    terminate : function() {
    }
});