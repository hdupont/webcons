ns_wconsapp.cmds.displayl = function(api) {
	var input = api.input()
	while (! input.isEmpty()) {
		var line = input.readLine();
		api.println(line);
	}
}

ns_wconsapp.cmds.help.echo = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " affiche du texte ligne par ligne.");
	api.println("Syntaxe:");
	api.println("    " + api.cmdName() + " texte");
	api.println("Avec:");
	api.println("    texte: le texte à afficher");
	api.println("Exemple d'utilisation:");
	api.println("    " + api.cmdName() + " bidule truc");
}
