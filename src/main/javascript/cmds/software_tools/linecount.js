ns_wconsapp.cmds.linecount = function(api) {
	var nl = 0;
	var c = null;
	while ((c = api.getc()) !== api.eof()) {
		if (c === api.newline()) {
			nl = nl + 1;
		}
	}
	api.putdec(nl, 1);
	api.putc(api.newline());
}
