ns_wconsapp.cmds.copy = function(api) {
	var c = null;
	while ((c = api.getc()) !== api.ENDFILE()) {
		api.putc(c);
	}
}
