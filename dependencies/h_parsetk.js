/**
 * NOTE Ici, les tokens sont séparés par des espaces.
 * NOTE En JavaScript les strings ne sont pas mutable donc on ne définit ici
 * que peek et pas des read.
 */
var h_parsetk = (function() {
	return {
		
		/**
		 * Retourne l'indice du premier caractère qui ne soit pas un espace
		 * dans la chaine str, en commençant la recherche à partir de l'indice
		 * start.
		 * @param {string} str La chaine dans laquelle on veut effectuer
		 * recherche.
		 * @param {int} start L'indice à partir duquel on veut effectuer
		 * la recherche.
		 * @returns {int} L'indice du premier caractère qui ne soit pas un
		 * espace, en commençant la recherche à partir de l'indice start.
		 */
		skipSpaces: function(str, start) {
			if (start > str.length - 1) {
				return -1;
			}
			var index = start;
			while (str[index] === " " && index < str.length) {
				index++;
			}
			return index;
		},
		
		/**
		 * Retourne l'indice du premier espace dans la chaine str, en
		 * commençant la recherche à partir de l'indice start.
		 * @param {string} str La chaine dans laquelle on veut effectuer
		 * recherche.
		 * @param {int} start L'indice à partir duquel on veut effectuer la
		 * recherche.
		 * @returns {int} L'indice du premier espace, en commençant la
		 * recherche à partir de l'indice start.
		 */
		skipNonSpaces: function(str, start) {
			if (start > str.length - 1) {
				return -1;
			}
			var index = start;
			while (str[index] !== " " && index < str.length) {
				index++;
			}
			return index;
		},
		
		/**
		 * Retourne l'indice du premier caractère suivant le token trouvé à
		 * partir de start. Retourn -1 si l'indice de départ est supérieur 
		 * à la longueur de la chaine.
		 * @returns {int} Retourne l'indice du premier caractère suivant le
		 * token trouvé à
		 */
		skipToken: function(str, start) {
			if (start > str.length - 1) {
				return -1;
			}
			var tokenFirstChar = this.skipSpaces(str, start);
			var spaceAfterToken = this.skipNonSpaces(str, tokenFirstChar);
			return spaceAfterToken;
		},
		
		/**
		 * Retourne le premier token trouvé à partir de start.
		 * @param {string} str La chaine dans laquelle on veut effectuer
		 * recherche.
		 * @param {int} start L'indice à partir duquel on veut effectuer la
		 * recherche.
		 * @returns {string} Le premier token trouvé à partir de start.
		 */
		peekToken: function(str, start) {
			if (start > str.length - 1) {
				return "";
			}
			var index = this.skipSpaces(str, start);
			var token = "";
			while (str[index] !== " " && index < str.length) {
				token += str[index];
				index++;
			}
			return token;
		},
		
		findTokenIndex: function(str, token) {
			return str.indexOf(token);
		},
		
		/**
		 * Retourne l'indice du premier caractère du index-ième token trouvé à
		 * partir du charactère d'indice start, avec index commençant à 1 et
		 * start commençant à zéro.
		 * @param {string} str La chaine dans laquelle s'effectue la recherche.
		 * @param {int} index Le numéro (commençant à 1) du token qu'on souhaite.
		 * @param {int} start L'indice du caractère à partir duquel effectuer
		 * la recherche.
		 * @returns {int} L'indice du premier caractère du token cherché.
		 * 
		 * TODO Uniformiser l'interface. Tout le monde commence à 1 ou à zéro.
		 */
		findFirstTokenIndex: function(str, index, start) {
			if (start > str.length - 1) {
				return -1;
			}
			var nonSpace = start;
			var space = start;
			for(var i = 0; i < index; i++) {
				nonSpace = this.skipSpaces(str, space);
				space = this.skipNonSpaces(str, nonSpace);
			}
			
			var firstTokenCharIndex = nonSpace;
			return firstTokenCharIndex;
		},
		
		/**
		 * Retourne l'index-ième token trouvé à partir du charactère d'indice start,
		 * avec index commençant à 1 et start commençant à zéro.
		 * @param {string} str La chaine dans laquelle s'effectue la recherche.
		 * @param {int} index Le numéro (commençant à 1) du token qu'on souhaite.
		 * @param {int} start L'indice du caractère à partir duquel effectuer
		 * la recherche.
		 * @returns {string} L'index-ième token trouvé à partir de start. 
		 * 
		 * EXAMPLE Soit la chaine
		 * Lorem ipsum dolor sit amet
		 * 01234567890123456789012345 <- indice des caractères (commence à 0)
		 * 1. Le premier token trouvé à partir du caractère d'indice 7
		 * findFirstToken: function("Lorem ipsum dolor sit amet", 1, 7)
		 * => "psum"
		 * 2. Le deuxième token trouvé à partir du caractère d'indice 7
		 * findFirstToken: function("Lorem ipsum dolor sit amet", 2, 7)
		 * => "dolor"
		 * 
		 * TODO Uniformiser l'interface. Tout le monde commence à 1 ou à zéro.
		 */
		findFirstToken: function(str, index, start) {
			if (start > str.length - 1) {
				return "";
			}
			var firstTokenCharIndex = this.findFirstTokenIndex(str, index, start);
			if (firstTokenCharIndex === -1) {
				return "";
			}
			var token = this.peekToken(str, firstTokenCharIndex);
			return token;
		}
	};
})();
