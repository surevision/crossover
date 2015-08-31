var SceneManager = {
	runningScene : null,
	call : function(scene) {
		// 切换场景
		cc.director.runScene(scene);
		// 更新输入监听器
		Input.clear();
		var inputLayer = new cc.Layer();
		inputLayer.setTag(INPUT_LAYER_TAG);
		KeyBoardInput.bind(inputLayer);
		scene.addChild(inputLayer);
		//记录当前场景
		runningScene = scene;
	}
}