ns_wconsapp.cmds.interactive.calci = function(api) {
	var arg = api.peekInputAfterToken(1);
	if (arg === "quit") {
		return api.quit;
	}
	var res = ns_wconsapp.helpers.calcExpr(arg);
	api.println("= " + res);
}

ns_wconsapp.cmds.help.calci = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " est la version interactive de calc.");
	api.println("Syntaxe:");
	api.println("    " + api.cmdName());
	api.println("Exemples d'utilisation:");
	api.println("    " + api.cmdName());
	api.println("Syntaxe dans la commande:");
	api.println("    nombre opérateur nombre");
	api.println("    quit");
	api.println("Avec:");
	api.println("    opérateur: +, -, *, /");
	api.println("    nombre: un nombre...");
	api.println("Note:");
	api.println("    Les espaces sont facultatifs entre l'opérateur et ses opérandes.");
	api.println("Exemples d'utilisation dans la commande:");
	api.println("    2+3");
	api.println("    4 * 5");
	api.println("    quit");
}
