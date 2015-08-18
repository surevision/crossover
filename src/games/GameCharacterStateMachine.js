var GameCharacterStateMachine = {
	changeState : function(character, state) {
		// state : {id = id, func = func}
		if (character.state) {
			character.state.onExit(character);
		}
		character.state = state;
		character.state.onEnter(character);
	}
}