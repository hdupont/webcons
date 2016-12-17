ns_wconsapp.cmds.inline.calc = function(api) {
	var expr = api.inputString();
	try {
		var res = "" + ns_wconsapp.helpers.calcExpr(expr);
		api.println(res);	
	}
	catch(e) {
		api.printHelp();
	}
}

ns_wconsapp.cmds.help.calc = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " permet d'effectuer une opération entre deux nombres.");
	api.println("Syntaxe:");
	api.println("    calc opérande1 opérateur opérande2");
	api.println("Avec:");
	api.println("    opérateur: +, -, *, /");
	api.println("    opérande1: un nombre");
	api.println("    opérande2: un nombre différent de zéro dans le cas de la division");
	api.println("Note:");
	api.println("    Les espaces sont facultatifs entre l'opérateur et ses opérandes.");
	api.println("Exemples d'utilisation:");
	api.println("    calc 2+3");
	api.println("    calc 4 * 5");
}
