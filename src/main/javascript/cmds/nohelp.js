ns_wconsapp.cmds.nohelp = function(api) {
	api.println("No help to give :(");
}

ns_wconsapp.cmds.help.nohelp = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " affiche \"No help to give :(\".");
	api.println("Syntaxe:");
	api.println("    " + api.cmdName());
	api.println("Exemple d'utilisation:");
	api.println("    " + api.cmdName());
}
