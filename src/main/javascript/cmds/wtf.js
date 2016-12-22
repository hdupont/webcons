ns_wconsapp.cmds.wtf = function(api) {
	api.println(api.args() + "... WTF?!");
}

ns_wconsapp.cmds.help.wtf = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " affiche la ligne tapée à l'invite de commande en lui ajoutant \"... WTF?!\" .");
	api.println("Syntaxe:");
	api.println("    " + api.cmdName());
	api.println("Exemple d'utilisation:");
	api.println("    " + api.cmdName());
	api.println("Remarque:");
	api.println("    C'est la commande utilisée par la console pour signifié à");
	api.println("    l'utilisateur qu'elle n'a pas compris ce qu'il lui demandait.");
}
