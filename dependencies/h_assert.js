/**
 * Boite à outils clavier.
 */
var h_assert = (function() {
	
	return {
		assert: function(predicat, message) {
			if (! predicat) {
				// Si le prédicat n'est pas vérifié on lève une exception.
				if (message) {
					throw new Error(message);
				}
				else {
					throw new Error();
				}
				
			}
		}
	};
})();
