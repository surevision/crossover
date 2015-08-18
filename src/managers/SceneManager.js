var SceneManager = {
	runningScene : null,
	call : function(scene) {
		cc.director.runScene(scene);
		runningScene = scene;
	}
}