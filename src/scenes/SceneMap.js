var SceneMap = SceneBase.extend({	
    ctor : function() {
        this._super();

    },
    start : function() {      
        this._super();
        var map = new GameMap();
        map.setup(1);
        map.isPassable(0, 11);
    }
});