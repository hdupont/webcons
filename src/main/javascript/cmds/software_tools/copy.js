ns_wconsapp.cmds.copy = function(api) {
	while (! api.eof()) {
		api.putc(api.getc());
	}
}

//ns_wconsapp.cmds.help.displayc = function(api) {
//	api.println("Description:");
//	api.println("    " + api.cmdName() + " affiche du texte caractère par caractère.");
//	api.println("Syntaxe:");
//	api.println("    " + api.cmdName() + " texte");
//	api.println("Avec:");
//	api.println("     texte: le texte à afficher");
//	api.println("Exemple d'utilisation:");
//	api.println("    " + api.cmdName() + " bidule truc");
//}
