ns_wconsapp.cmds.charcount = function(api) {
	var nc = 0;
	var c = null;
	while ((c = api.getc()) !== api.ENDFILE()) {
		nc = nc + 1;
	}
	api.putdec(nc, 1);
	api.putc(api.NEWLINE());
}
