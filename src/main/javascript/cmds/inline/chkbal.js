ns_wconsapp.cmds.inline.chkbal = function(api) {
	var parentcnt = 0;
	var input = api.input();
	while (! input.isEmpty()) {
		var c = input.readChar(); 
		if (c === '(') {
			parentcnt++;
		}
		if (c === ')') {
			parentcnt--;
		}
	}
	api.println(parentcnt === 0 ? "OK" : "NOT OK");
}

ns_wconsapp.cmds.help.chkbal = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " vérifie si une expression est bien parenthésée.");
	api.println("Syntaxe:");
	api.println("    " + api.cmdName() + " exp");
	api.println("Avec:");
	api.println("    exp: l'expression à vérifier.");
	api.println("Exemple d'utilisation:");
	api.println("    " + api.cmdName() + " ((bonjour))(tout (le))(monde)");
}
