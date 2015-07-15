// 标题界面
var SceneTitle = SceneBase.extend({
    ctor : function() {
        this._super();
    },
    start : function() {      
        this._super();
        var size = cc.director.getWinSize();
        var sprite = cc.Sprite.create(res.HelloWorld);
        sprite.setPosition(size.width / 2, size.height / 2);
        sprite.setScale(0.8);
        this.addChild(sprite, 0);

        var label = cc.LabelTTF.create("爱的战士", "微软雅黑", 40);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label, 1);
        SceneManager.call(new SceneMap());
    }
});