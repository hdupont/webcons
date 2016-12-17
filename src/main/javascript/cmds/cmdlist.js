ns_wconsapp.cmds.cmdlist = function(api) {
	api.println("Commandes comprises par la console: ");
	api.println("    " + api.inputString());
}

ns_wconsapp.cmds.help.cmdlist = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " liste les commandes comprises par la console.");
	api.println("Syntaxe:");
	api.println("    " + api.cmdName());
	api.println("Exemple d'utilisation:");
	api.println("    " + api.cmdName());
}
