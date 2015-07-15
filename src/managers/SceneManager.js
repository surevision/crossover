var SceneManager = {
	runningScene : null,
	call : function(scene) {
		runningScene = scene;
		cc.director.runScene(scene);
	}
}