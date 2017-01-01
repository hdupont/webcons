ns_wconsapp.cmds.wordcount = function(api) {
	var nw = 0;
	var c = null;
	var inword = false;
	while ((c = api.getc()) !== api.eof()) {
		if (c === api.blank() || c === api.newline() || c === api.tab()) {
			inword = false;
		}
		else if (! inword) {
			inword = true;
			nw = nw + 1;
		}
	}
	api.putdec(nw, 1);
	api.putc(api.newline());
}
