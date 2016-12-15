ns_wconsapp.cmds.inline.calc = function(api) {
	var expr = api.inlineCmdArgsString();
	try {
		var res = ns_wconsapp.helpers.calcExpr(expr);
		api.println(res);	
	}
	catch(e) {
		api.printHelp();
	}
	var toto = 10;
}

ns_wconsapp.cmds.help.calc = function(api) {
	api.println("Description:");
	api.println("    calc permet d'effectuer une opération entre deux nombres.");
	api.println("Syntaxe:");
	api.println("    calc nombre opérateur nombre");
	api.println("Avec:");
	api.println("    opérateur: +, -, *, /");
	api.println("    nombre: un nombre...");
	api.println("Note:");
	api.println("    Les espaces sont facultatifs entre l'opérateur et ses opérandes.");
	api.println("Exemple d'utilisation:");
	api.println("    calc 2 * 3");
}
