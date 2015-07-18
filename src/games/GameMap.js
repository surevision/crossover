// GameMap

var GameMap = cc.Class.extend({

	TILE_WIDTH : 32,
	TILE_HEIGHT : 32,

	ctor : function() {
		this.mapId = 0;		// 地图id
		this.tmx = null;	//　tmx文件数据(CCTMXTiledMap)
		this.displayX = 0;	// 显示坐标x
		this.displayY = 0;	// 显示坐标Y
		this.eventLayer = null;	// 事件层
		this.events = {};		// 事件
		this.tileMapLayers = {}; 	// 3个tilemap层
		this.scrollDir = 0;		// 滚动方向
		this.scrollRest = 0;	// 滚动剩余距离
		this.scrollSpeed = 4;	// 滚动速度
	},
	// 读取地图信息
	setup : function(mapId) {
		this.mapId = mapId;
		this.tmx = new cc.TMXTiledMap(this.getMapFileName(mapId));	// 需要add到父节点以防止被释放
		console.log("loaded map %d", mapId);
		console.log("width %d, height %d", this.width(), this.height());
		// 读取事件层信息
		this.eventLayer = this.tmx.getObjectGroup("events");
		this.events = this.eventLayer.getObjects();
		// 读取tilemap层信息
		this.tileMapLayers = [
								this.tmx.getLayer("layer1"), 
								this.tmx.getLayer("layer2"), 
								this.tmx.getLayer("layer3")
							];
	},
	// 销毁
	clean : function() {
		this.mapId = 0;
		this.displayX = 0;
		this.displayY = 0;
		this.eventLayer = null;	// 事件层
		this.events = {};		// 事件
		this.scrollDir = 0;
		this.scrollRest = 0;
		this.scrollSpeed = 4;
		if (this.tmx != null) {
			this.tmx.removeFromParent();
		}
		this.tmx = null;
	},
	getMapFileName : function(mapId) {
		return cc.formatStr("res/maps/map%d.tmx", mapId);
	},

	// 取得地图大小(格子数)
	width : function() {
		return this.tmx.getMapSize().width;
	},
	height : function() {
		return this.tmx.getMapSize().height;
	},
	// 指定坐标的可通行度
	isPassable : function(x, y) {
		if ((x < 0) || (x >= this.width()) || (y < 0) || (y >= this.height())) {
			return false;
		}
		for (var i = 0; i < 3; i += 1) {
			var layer = this.tileMapLayers[i];
			var gid = layer.getTileGIDAt(cc.p(x, y));
			if (gid != 0) {
				var prop = this.tmx.getPropertiesForGID(gid);
				if (prop && prop["passable"] == "0") {
					return false;
				}
			}
		}
		return true;
	}
});