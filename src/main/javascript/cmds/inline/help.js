// Cette commande est géré directement par la console. On ne définit ici que
// l'aide.

ns_wconsapp.cmds.help.help = function(api) {
	var firstCmdUnderstood = api.inputString().split(", ")[0]
	api.println("Description:");
	api.println("    " + api.cmdName() + " affiche l'aide d'une commande.");
	api.println("Syntaxe:");
	api.println("    " + api.cmdName() + " nom");
	api.println("Avec:");
	api.println("    nom: le nom d'une commande comprise par la console");
	api.println("Commandes comprises par la console: ");
	api.println("    " + api.inputString());
	api.println("Exemple d'utilisation: ");
	api.println("    help " + firstCmdUnderstood);
}
