ns_wconsapp.cmds.displayc = function(api) {
	var input = api.input();
	while (! input.isEmpty()) {
		var c = input.readChar();
		api.printChar(c);
	}
	api.newLine();
}

// Précédente version.
//ns_wconsapp.cmds.displayc = function(api) {
//	var str = api.inputString()
//	for (var i = 0; i < str.length; i++) {
//		var character = str[i];
//		api.printChar(character);
//	}
//	api.newLine();
//}

ns_wconsapp.cmds.help.displayc = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " affiche du texte caractère par caractère.");
	api.println("Syntaxe:");
	api.println("    " + api.cmdName() + " texte");
	api.println("Avec:");
	api.println("     texte: le texte à afficher");
	api.println("Exemple d'utilisation:");
	api.println("    " + api.cmdName() + " bidule truc");
}
