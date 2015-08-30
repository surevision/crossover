var game = {
	run : function() {
		cc.game.onStart = function() {
			//load resources
			cc.LoaderScene.preload(preloads, function() {
				SceneManager.call(new SceneTitle());
			}, this);
		};
		cc.game.run("gameCanvas");
	}
};