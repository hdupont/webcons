/**
 * Boite à outils clavier.
 */
var h_log = (function() {
	
	var _defaultLogger = console && console.log ? console.log : function() {};
	var _debugLogger = console && console.debug ? console.debug : _defaultLogger;
	var _infoLogger = console && console.info ? console.info : _defaultLogger;
	
	return {
		debug: function(msg) {
			_debugLogger("[debug] " + msg);
		},
		info: function(msg) {
			_infoLogger("[info] " + msg);
		}
	};
})();