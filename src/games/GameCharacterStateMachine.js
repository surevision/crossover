var GameCharacterStateMachine = cc.Class.extend({
	ctor : function(character) {
		this.character = character;
		this.currState = null;
	},
	changeState : function(state) {
		// state : {id = id, func = func}
		if (this.currState) {
			this.currState.onExit(this.character);
		}
		this.currState = state;
		state.onEnter(this.character);
	},
	update : function() {
		if (this.currState) {
			this.currState.onExecute(this.character);
		}
	}
});