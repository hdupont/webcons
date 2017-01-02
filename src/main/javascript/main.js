/**
 * Affiche un interpréteur de commande.
 * 
 * Les deux commandes fondamentales sont 
 * 1. cmdlist qui liste la liste des commandes comprises par l'interpréteur.
 * 2. help <nom d'une commande> qui affiche l'aide d'une commande (obtenue par
 *  exemple avec la commande précédente)
 */
(function(cmds, wcons) {
	
	// On ajoute une console au DOM.
	var cons = wcons.appendTo("h_wcapp", "h_wcapp_din", "h_wcapp_dout");
	
	// On ajoute les commandes interactives et leur aide.
	for (var cmdName in cmds) {
		cons.addCommand(cmdName, cmds[cmdName]);
	}

})(ns_wconsapp.cmds, h_wcons);
