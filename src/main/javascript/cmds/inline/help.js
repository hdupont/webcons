ns_wconsapp.cmds.help.wconshelp = function(api) {
	api.println("help affiche de l'aide sur une commande.");
	api.println("Syntaxe :");
	api.println("    help nom");
	api.println("Avec:");
	api.println("    nom: le nom d'une commande comprise par la console");
	api.println("Commandes comprises par la console: ");
	api.println("    " + api.inputString());
}
