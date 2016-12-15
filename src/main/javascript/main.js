// Where the magic happens.
(function(cmds, wcons) {
	
	var cons = wcons.appendTo("calcapp");
	
	for (var cmdName in cmds.interactive) {
		cons.addInteractiveCommand(cmdName, cmds.interactive[cmdName]);
	}
	
	for (var cmdName in cmds.inline) {
		cons.addInlineCommand(cmdName, cmds.inline[cmdName]);
	}

	for (var cmdName in cmds.help) {
		cons.addHelpCommand(cmdName, cmds.help[cmdName]);
	}
	
})(ns_wconsapp.cmds, h_wcons);
