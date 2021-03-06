// GameMap

var GameMap = cc.Class.extend({
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
		console.log("mapname : %s", this.getMapFileName(mapId));
		this.tmx = new cc.TMXTiledMap(this.getMapFileName(mapId));	// 需要add到父节点以防止被释放
		console.log("loaded map %d", mapId);
		console.log("width %d, height %d", this.width(), this.height());
		// 读取事件层信息
		this.eventLayer = this.tmx.getObjectGroup(Map.LAYER_NAME_EVENT);
		this.events = this.eventLayer.getObjects();
		// 读取tilemap层信息
		this.tileMapLayers = [
								this.tmx.getLayer(Map.LAYER_NAME_1), 
								this.tmx.getLayer(Map.LAYER_NAME_2), 
								this.tmx.getLayer(Map.LAYER_NAME_3)
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
				//console.log("passage checking gid %d", gid);
				var prop = this.tmx.getPropertiesForGID(gid);
				if (prop && prop[Map.TILE_PROP_OBSTACLE] == eMap.Obstacle.unpassable) {
					return false;
				}
			}
		}
		// 检测事件
		for (var i = 0; i < this.events.length; i += 1) {
			var e = SceneManager.runningScene.map.events[i];
			var _x = parseInt(e.x) / Map.TILE_WIDTH;
			var _y = this.height() - (parseInt(e.y) / Map.TILE_HEIGHT);
			if (x == _x && y == _y - 1 && 
					e[Map.TILE_PROP_OBSTACLE] == eMap.Obstacle.unpassable) {
				return false;
			}
		}
		return true;
	},
	// 是否为斜坡
	isSlope : function(x, y) {
		if ((x < 0) || (x >= this.width()) || (y < 0) || (y >= this.height())) {
			return false;
		}
		for (var i = 0; i < 3; i += 1) {
			var layer = this.tileMapLayers[i];
			var gid = layer.getTileGIDAt(cc.p(x, y));
			if (gid != 0) {
				//console.log("passage checking gid %d", gid);
				var prop = this.tmx.getPropertiesForGID(gid);
				if (prop && prop[Map.TILE_PROP_SLOPE] == eMap.Slope.SmallLeft) {
					return true;
				}
				if (prop && prop[Map.TILE_PROP_SLOPE] == eMap.Slope.SmallRight) {
					return true;
				}
			}
		}
		return false;
	},
	// 居中显示玩家角色
	centerPlayer : function() {
		var character = SceneManager.runningScene.player;
		var cx = character.real_x;
		var cy = character.real_y;
		var size = SceneManager.runningScene.size;
		var size_w = size.width;
		var size_h = size.height;

		var x, y;
		if (cx < size_w / 2) {
			x = 0;
			character.screen_x = cx;
		} else if (cx > this.width() * 32 - size_w / 2) {
			//console.log("end!!!!!!!!!!");
			x = (-this.width()) * 32 + size_w;
			character.screen_x = size_w - (this.width() * 32 - cx) - x;
		} else {
			x = -cx + size_w / 2;
			character.screen_x = size_w / 2 - x;
		}
		character.screen_y = this.tmx.getContentSize().height - cy;
		y = 0;
		this.tmx.setPosition(x, y);
	},
	// 取得斜坡y偏移
	slopeY : function(x, y) {
		for (var i = 0; i < this.tileMapLayers.length; i += 1) {
			var layer = this.tileMapLayers[i];
			var _x = parseInt(x / 32);
			var _y = parseInt(y / 32);
			var gid = layer.getTileGIDAt(cc.p(_x, _y));
			if (gid != 0) {
				var prop = this.tmx.getPropertiesForGID(gid);
				//console.log(gid);
				//console.log(prop);
				if (prop && prop[Map.TILE_PROP_SLOPE] == eMap.Slope.SmallLeft) {
					var offsetX = x - _x * 32;
					return offsetX;// * 0.707;
				} else if (prop && prop[Map.TILE_PROP_SLOPE] == eMap.Slope.SmallRight) {
					var offsetX = x - _x * 32
					return 32.0 - offsetX;// * 0.707;
				}
			}
		}
		return 0;
	}
});