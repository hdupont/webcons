ns_wconsapp.helpers.calcExpr = (function(OneOpCalculator) {
	
	/**
	 * Effectue le calcul représenté par l'expression passée en paramètres.
	 * L'expression attendue est de la forme:
	 *     <nombre><opérateur><nombre>
	 * 
	 * EXAMPLE
	 * calcExpr("2*3") => 6
	 * calcExpr("2 +3") => 5
	 * @param {string} expr L'expression à évaluer.
	 * @returns {number} Le résultat de l'évaluation.
	 * @throws {Error} Si la chaine passé en paramètre ne représente pas une
	 * expression valide.
	 */
	return function calcExpr(exprStr) {
		
		/**
		 * Extrait les opérandes et l'opérateur de l'expression passé en
		 * paramètre.
		 * @param {string} L'expression qu'on souhaite évaluer.
		 * @returns {array} Un tableau contenant le premier opérande,
		 * l'opérateur et le second opérande dans cet ordre.
		 * @throws {Error} Si l'expression n'est pas parsable. 
		 * NOTE Inspiré de code trouvé sur le net.
		 */
		function parseExpression(exprStr) {
			var exprRegExp = /(.+)(\+|\-|\*|\/)(.+)/;
			var match = exprRegExp.exec(exprStr);
			if (match === null) {
				var errorMsg = "Expression non reconnue"
				throw new Error(errorMsg + (exprStr ===  "" ? "" : (": " + exprStr)));
			}

			match = match.map(function(exprPart) {
				return exprPart.trim();
			});
			
			var operand1 = match[1];
			var operator = match[2];
			var operand2 = match[3];
			
			return [operand1, operator, operand2];
		}
		
		/**
		 * Extrait un nombre d'une chaine de caractère.
		 * @returns {number} Le nombre extrait de la chaine.
		 * @throws {Error} S'il est impossible d'extraire un nombre.
		 */
		function parseNum(str, index) {
			var num = parseFloat(str);
			if (isNaN(num)) {
				throw new Error("Arg " + (index+1) + " (" + str + ") n'est pas un nombre...");
			}
			else {
				return num;
			}
		}

		// On créer un calculateur
		var calculator = new OneOpCalculator();
		
		// On extrait les opérandes et l'opérateur de l'expression
		var exprComponents = parseExpression(exprStr)
		var operand1 = parseNum(exprComponents[0]);
		var operand2 = parseNum(exprComponents[2]);
		var operator = exprComponents[1];
		
		// On retourne le résultat du calcul.
		return calculator.calculate(operand1, operator, operand2);
	};
})(H_OneOpCalculator);
