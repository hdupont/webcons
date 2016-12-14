ns_wconsapp.cmds.inline.calc = function(api) {
	var expr = api.inlineCmdArgsString();
	var res = ns_wconsapp.helpers.calcExpr(expr);
	api.println(res);
}

ns_wconsapp.cmds.inline.calc_help = function(api) {
	api.println("Syntaxe:");
	api.println("    calc nombre opérateur nombre");
	api.println("");
	api.println("où opérateur vaut : +, -, *, /");
	api.println("où nombre est nombre...");
	api.println("avec ou sans espace entre les nombres et l'opérateur :)");
	api.println("");
	api.println("Par exemple d'utilisation:");
	api.println("    calc 2 * 3");
}
