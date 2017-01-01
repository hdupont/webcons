ns_wconsapp.cmds.detab = function(api) {
	function tabpos(col, tabstops) {
		var res = true;
		if (col > MAXLINE) {
			res = true;
		}
		else {
			res = tabstops[col];
		}
		return res;
	}
	
	function settabs(tabstops) {
		var TABSPACE = 4; // 4 spaces per tab
		var i;
		for (var i = 1; i < MAXLINE; i++) {
			tabstops[i] = ((i % TABSPACE) === 1)
		}
	}
	
	var MAXLINE = 1000;
	var c = null;
	var col = 1;
	var tabstops = [];
	
	settabs(tabstops);
	
	while ((c = api.getc()) !== api.ENDFILE()) {
		if (c === api.TAB()) {
			do {
				api.putc(api.BLANK());
				col = col + 1;
			} while (! tabpos(col, tabstops));
		}
		else if (c === api.NEWLINE()) {
			api.putc(api.NEWLINE());
			col = 1;
		}
		else {
			api.putc(c);
			col = col + 1;
		}
	}
}
