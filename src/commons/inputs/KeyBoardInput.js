var KeyBoardInput = {
	KeyBoardMap : {
		40 : Keys.DOWN,	// ↓
		37 : Keys.LEFT,		// ←
		39 : Keys.RIGHT,	// →
		38 : Keys.UP,		// ↑
		13 : Keys.C,			// Enter
		90 : Keys.C,			// Z
		27 : Keys.B,			// Esc
		88 : Keys.B,			// X
		16 : Keys.A,			// Shift
	},
	bind : function(layer) {
		if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
			cc.eventManager.addListener({
				event : cc.EventListener.KEYBOARD,
				onKeyPressed : function(key, event) {
					//console.log("onKeyPressed %d", key);
					if (KeyBoardInput.KeyBoardMap[key]) {
						var e = new KeyEvent(KeyBoardInput.KeyBoardMap[key], KeyEventTypes.DOWN);
						Input.events.push(e);
					}
				},
				onKeyReleased : function(key, event) {
					//console.log("onKeyReleased %d", key);
					if (KeyBoardInput.KeyBoardMap[key]) {
						var e = new KeyEvent(KeyBoardInput.KeyBoardMap[key], KeyEventTypes.UP);
						Input.events.push(e);
					}
				}
			}, layer);
		}
	}
}