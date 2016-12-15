ns_wconsapp.cmds.inline.echo = function(api) {
	api.println(api.inlineCmdArgsString());
}

ns_wconsapp.cmds.help.echo = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " affiche ce qui suit " + api.cmdName() + ".");
	api.println("Syntaxe:");
	api.println("    " + api.cmdName() + " x");
	api.println("Avec:");
	api.println("    x: ce qui suit " + api.cmdName());
	api.println("Exemple d'utilisation:");
	api.println("    " + api.cmdName() + " bidule truc");
}