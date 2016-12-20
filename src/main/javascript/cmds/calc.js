ns_wconsapp.cmds.calc = (function(OneOpCalculator) {
	return function(api) {
		
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
		function calcExpr(exprStr) {
			
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
		}
		
		var expr = api.inputString();
		try {
			var res = "" + calcExpr(expr);
			api.print(res);	
		}
		catch(e) {
			api.printHelp();
		}
	}
})(H_OneOpCalculator); 

ns_wconsapp.cmds.help.calc = function(api) {
	api.println("Description:");
	api.println("    " + api.cmdName() + " permet d'effectuer une opération entre deux nombres.");
	api.println("Syntaxe:");
	api.println("    calc opérande1 opérateur opérande2");
	api.println("Avec:");
	api.println("    opérateur: +, -, *, /");
	api.println("    opérande1: un nombre");
	api.println("    opérande2: un nombre différent de zéro dans le cas de la division");
	api.println("Note:");
	api.println("    Les espaces sont facultatifs entre l'opérateur et ses opérandes.");
	api.println("Exemples d'utilisation:");
	api.println("    calc 2+3");
	api.println("    calc 4 * 5");
}
