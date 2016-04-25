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

};

// TileMap枚举
var eMap = {
	// 障碍物
	Obstacle : {
		unpassable : "1"	// 是不可通行的障碍物
	}
};

// 事件层指令
var eEvent = {
	toEval : "toEval",
	commands : "commands"
}

// 角色默认层级
var DEFAULT_CHARACTER_LAYER = 1;

// 跳跃加速度
var SPEED_JUMP = 12;
// 行走速度
var SPEED_MOVE = 6;
// 重力
var GRAVITY = 0.9;

// 人物状态
var CharacterState = {
	IDLE : "IDLE",
	MOVE : "MOVE",
	JUMP : "JUMP",
	FALL : "FALL"
};

var INPUT_LAYER_TAG = 9998;

// 按键输入状态
var KeyEventTypes = {
	DOWN : "DOWN",
	UP : "UP"
};

// 按键码
// 按键监听者映射对应的按键(键盘)码到这里
var Keys = {
	DEBUG : "DEBUG",
	// 下
	DOWN : "DOWN",
	// 左
	LEFT : "LEFT",
	// 右
	RIGHT : "RIGHT",
	// 上
	UP : "UP",
	// 确定
	C : "C",
	// 取消
	B : "B",
	// 加速
	A : "A",
};

// Armature动画路径
var ArmaturePathPre = "res/armatures/";

// 人物动画动作
var ArmatureCharacterMovements = {
	IDLE : "idle",
	MOVE : "walk",
	JUMP : "jump"
};
var ACM = ArmatureCharacterMovements;

// 特效动画动作
var ArmatureEffectMovements = {
	EFFECT : "effect"
};
var AEM = ArmatureEffectMovements;
