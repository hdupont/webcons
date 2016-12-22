ns_wconsapp.cmds.chkbal = function(api) {
	var input = api.input();
	
	// On détermine de quel caractère on doit vérifier "l'équilibre".
	var c = input.readToken();
	var openingChar = "";
	var closingChar = "";
	if (c === "(") {
		openingChar = c;
		closingChar = ")";	
	}
	else if (c === "[") {
		openingChar = c;
		closingChar = "]";
	}
	else if (c === "{") {
		openingChar = c;
		closingChar = "}";
	}
	else if (c === "<") {
		openingChar = c;
		closingChar = ">";
	}
	
	// On vérifie que l'expression est bien équilibrée.
	var charCount = 0;
	var charCountChanged = false;
	while (! input.isEmpty()) {
		var c = input.readChar(); 
		if (c === openingChar) {
			charCount++;
			charCountChanged = true;
		}
		if (c === closingChar) {
			charCount--;
			charCountChanged = true;
		}
	}
	var isBalanced = (charCount === 0) && charCountChanged;
	api.println(isBalanced ? "OK" : "NOT OK");
}

ns_wconsapp.cmds.help.chkbal = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " vérifie si une expression est bien \"équilibrée\".");
	api.println("Syntaxe:");
	api.println("    " + api.cmdName() + " ouvrant exp");
	api.println("Avec:");
	api.println("    ouvrant: le caractère ouvrant d'une des paires (), {}, [], <>");
	api.println("    exp: l'expression à vérifier.");
	api.println("Exemple d'utilisation:");
	api.println("    " + api.cmdName() + " ((hello))(world)");
	api.println("    " + api.cmdName() + " {{hello}}{world}");
}
