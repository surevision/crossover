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

		var label = cc.LabelTTF.create("", "微软雅黑", 40);
		label.setPosition(size.width / 2, size.height / 2);
		this.addChild(label, 1);

		var testLabel = ccui.Text.create("test", "微软雅黑", 40);
		testLabel.setPosition(0, 0);
		testLabel.setColor(cc.color(255, 0, 0, 255));

		var testLayer = ccui.Layout.create();
		testLayer.setContentSize(500, 500);
		testLayer.setColor(cc.color(255, 0, 0, 255));
		this.addChild(testLayer);
		testLayer.setPosition(100, 100);

		testLayer.addChild(testLabel);

		var richLabel = new UIRichText(200, true);
		richLabel.setString("测试 $S<48>← ←$C<2>！$S<24>$C<3>面码$C<0>！$I<res/armatures/TuanZi/TuanZi0.png>$A<TuanZi,idle>");
		this.addChild(richLabel, 2);
		richLabel.setPosition(10, size.height);
		//SceneManager.call(new SceneMap());
	}
});