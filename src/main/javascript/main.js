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
	var cons = wcons.appendTo("calcapp");
	
	// On ajoute les commandes en ligne et leur aide.
	for (var cmdName in cmds.interactive) {
		cons.addInteractiveCommand(cmdName, cmds.interactive[cmdName]);
		cons.addHelpCommand(cmdName, cmds.help[cmdName]);
	}
	
	// On ajoute les commandes interactives et leur aide.
	for (var cmdName in cmds.inline) {
		cons.addInlineCommand(cmdName, cmds.inline[cmdName]);
		cons.addHelpCommand(cmdName, cmds.help[cmdName]);
	}

})(ns_wconsapp.cmds, h_wcons);
