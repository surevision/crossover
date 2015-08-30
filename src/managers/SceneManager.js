var SceneManager = {
	runningScene : null,
	call : function(scene) {
		var inputLayer = new cc.Layer();
		inputLayer.setTag(INPUT_LAYER_TAG);
		KeyBoardInput.bind(inputLayer);
		scene.addChild(inputLayer);
		cc.director.runScene(scene);
		runningScene = scene;
	}
}