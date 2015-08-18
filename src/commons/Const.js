// 常量定义

// TileMap常量
var Map = {
	TILE_WIDTH : 32,	// 地图像素单位宽度
	TILE_HEIGHT : 32,	// 地图像素单位高度

	LAYER_NAME_EVENT : "events",	// 图层名 事件层
	LAYER_NAME_1 : "layer1",		// 图层名 层1
	LAYER_NAME_2 : "layer2",		// 图层名 层2
	LAYER_NAME_3 : "layer3",		// 图层名 层3
	LAYER_NAME_4 : "layer4",		// 图层名 层4 特殊

	TILE_PROP_OBSTACLE : "obstacle"	// 图块属性 是否为障碍物

}

// TileMap枚举
var eMap = {
	// 障碍物
	Obstacle : {
		unpassable : "1"	// 是不可通行的障碍物
	}
}

// 四方向
var Dirs = {
	DOWN : 2,
	LEFT : 4,
	RIGHT : 6,
	UP : 8
}

// 跳跃加速度
var SPEED_JUMP = 10;
// 行走速度
var SPEED_MOVE = 8;
// 重力
var GRAVITY = 0.9;

// 人物状态
var State = {
	IDLE : "IDLE",
	MOVE : "MOVE",
	JUMP : "JUMP",
	FALL : "FALL"
}