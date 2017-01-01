/**
 * Code d'une console web.
 * 
 * La console
 * ----------
 * Une console permet d'exécuter des commandes (Command) tapées sur
 * une ligne de commandes (IoLine) après que l'utilisateur ait appuyé sur la
 * touche "Entrée".
 * Les commandes comprises par la console se trouvent dans une liste
 * (Commands).
 * La console met à disposition de ses commandes la ligne tapée par
 * l'utilisateur (Input) ainsi qu'un moyen de procéder à des affichages
 * (IoLine). 
 * 
 * Les commandes
 * -------------
 * Une commande peut exécuter les instructions mises à sa dispostion dans l'api
 * des commandes (CommandApi).
 * 
 * Les Entrées/Sorties
 * -------------------
 * L'utilisateur tape une suite de caractères sur la ligne de 
 * commande (IoLine) qui délègue l'affichage à sa vue (LineDomView).
 * La ligne de commande est équipée d'un curseur et est éditable, l'utilisateur
 * peut déplacer le curseur et procéder à des ajouts ou des suppression de
 * caractères au niveau du curseur.
 * 
 * Grammaire des commandes
 * -----------------------
 * La grammaire des commandes est données en EBNF à la différence que les
 * non-terminaux sont entre chevrons (<>) comme en BNF.
 * 
 * NOTE 
 * <concmd> ::= <cmd> [<inopt>]
 * <cmd> ::= <name><args>
 * <inopt> ::= "<" " " <insrc>
 * <insrc> ::= "" | "din"
 * <name> ::= l'identificateur d'une commande
 * <args> ::= une suite de token représentant les arguments de la commande
 */

/**
 *  Namespace de la console.
 */
var ns_wcons = {};

/**
 * -----------------
 * @class CommandApi
 * -----------------
 * Une CommandApi est l'API utilisable par une commande définie par
 * l'utilisateur.
 * NOTE Dans une commande self représente la commande.
 */
ns_wcons.CommandApi = (function(CommandExitException) {
	
	/**
	 * Construit une API utilisable par une commande.
	 * @property {Command} _cmd La commande pour laquelle cette API est définie.
	 * @property {Input} _input L'entrée utilisateur qui a lancé la commande
	 * pour laquelle cette API est définie.
	 * @property {IoLine} _ioLine L'objet permettant d'effectuer des affichages
	 * à la commande pour laquelle on définit cette API.
	 * @property {Command} _helpCmd La commande d'aide de la commande pour
	 * laquelle on définit cette API.
	 * 
	 * NOTE Une API est créée à chaque appel de commande.
	 */
	function CommandApi(cmd, input, ioLine, helpCmd) {
		this._cmd = cmd;
		this._input = input;
		this._ioLine = ioLine;
		this._helpCmd = helpCmd;
	}
	
	// Affichage
	// ---------
	
	/**
	 * Affiche dans la console la chaine passée en paramètre.
	 * @param {string} str La chaine qu'on souhaite afficher dans la console.
	 */
	CommandApi.prototype.print = function(str) {
		this._ioLine.print(str);
	};

	CommandApi.prototype.printChar = function(character) {
		this._ioLine.addChar(character);
	};
	
	CommandApi.prototype.newLine = function() {
		this._ioLine.moveForward();
	};
	
	/**
	 * Affiche dans la console la chaine passée en paramètre puis passe à la
	 * ligne suivante.
	 * @param {string} str La chaine qu'on souhaite afficher dans la console.
	 */
	CommandApi.prototype.println = function(cmdOutput) {
		this._ioLine.println(cmdOutput);
	};
	
	CommandApi.prototype.printPrompt = function() {
		this._ioLine.printPrompt(this._cmd.getPrompt());
	}
	
	CommandApi.prototype.printHelp = function() {
		if (typeof this._helpCmd !== "undefined") {
			this._helpCmd.executeHandler(this);
		}
		else {
			this._ioLine.println("No help to give :(");
		}
	}
	
	// Input
	// -----
	
	/**
	 * Retourne sous la forme d'un objet Input l'entrée utilisateur.
	 * @returns {Input} L'input correspondant à l'entrée utilisateur.
	 */
	CommandApi.prototype.input = function() {
		return this._input;
	};
	
	/**
	 * Retourne sous la forme d'une chaine l'entrée utilisateur.
	 * @returns {String} La chaine correspondant à l'entrée utilisateur.
	 */
	CommandApi.prototype.inputString = function() {
		return this._input.toString();
	};
	
	CommandApi.prototype.args = function() {
		return this._input;
	};
	
	CommandApi.prototype.cmdName = function() {
		return this._cmd.getName();
	}
	
	
	// Terminaison
	// -----------
	
	/**
	 * Attribut servant à indiquer à l'interpréteur de commande que la commande
	 * a terminée son exécution.
	 * NOTE Une commande est quittée avec un "return". 
	 */
	CommandApi.prototype.quit = "quit";
	
	// Software tools primitives
	// -------------------------
	
	CommandApi.prototype.getc = function() {
		return this._input.readCharCode();
	};
	
	CommandApi.prototype.putc = function(charCode) {
		var character = String.fromCharCode(charCode);
		this._ioLine.print(character);
	};

	CommandApi.prototype.eof = function(c) {
		return this._input.oefCode();
	};
	
	return CommandApi;
})(ns_wcons.CommandExitException);

/**
 * --------------
 * @class Command
 * --------------
 * Une Command est une commande que la console peut exécuter.
 */
ns_wcons.Command = (function(CommandApi, CommandExitException) {
	
	function Command(name, handler) {
		this._name = name;
		this._handler = handler;
		this._args = null;
		this._options = null;
		this._quitted = true;
	}
	Command.prototype.getName = function() {
		return this._name;
	};
	// L'input qui a déclenché l'appelle et la ligne permettant les affichages.
	Command.prototype.exec = function(input, ioLine, helpCmd) {
		var api = new CommandApi(this, input, ioLine, helpCmd);
		console.log("Api created for: " +  this.getName());
		var cmdReturn = this.executeHandler(api);
		this._quitted = true;
	};
	Command.prototype.executeHandler = function(api) {
		var cmdReturn = this._handler(api);		
	};
	Command.prototype.setArgs = function(args) {
		return this._args = args;
	};
	Command.prototype.getIntroduction = function() {
		return getOption(this, "description");
	};
	Command.prototype.quitted = function() {
		return this._quitted;
	};
	
	function getOption(self, optionName) {
		var option = null;
		if (self._options !== null && typeof self._options !== "undefined") {
			option = self._options[optionName];
		}
		else {
			option = defautOptions(self)[optionName];
		}
		return option; 
	}
	
	function defautOptions(self) {
		return {
			description: self.getName() + " vous souhaite la bienvenue :)"
		}; 
	}
	
	return Command;
})(ns_wcons.CommandApi, ns_wcons.CommandExitException);

/**
 * ---------------
 * @class Commands
 * ---------------
 * Une Commands est une liste de Command.  
 */
ns_wcons.Commands = (function(Command) {
	
	function Commands() {
		this._commands = [];
	}
	Commands.prototype.add = function(name, handler) {
		var inlineCmd = new Command(name, handler);
		this._commands.push(inlineCmd);
	};
	Commands.prototype.get = function(name) {
		var res = null;
		for (var i = 0; i < this._commands.length; i++) {
			var currentCommand = this._commands[i];
			if (currentCommand.getName() === name) {
				res = currentCommand;
				break;
			}
		}
		
		return res;
	};
	Commands.prototype.getDefaultCommand = function() {
		return this.get("wtf");
	};
	Commands.prototype.getNamesSorted = function(fun) {
		var sortedNames = [];
		this._commands.forEach(function(cmd) {
			sortedNames.push(cmd.getName());
		});
		sortedNames.sort();
		return sortedNames;
	};
	
	return Commands;
})(ns_wcons.Command);

/**
 * ------------------
 * @class LineDomView
 * ------------------
 * Une LineDomView représente une ligne de la console telle qu'elle est vue par
 * l'utilisateur.
 */
ns_wcons.LineDomView = (function() {
	
	// public
	// ------
	
	/**
	 * Créer une LineDomView équipée d'un curseur placé au début.
	 */
	function LineDomView(domElt) {
		this._domContainer = domElt;
		this._prefix = "";
		this._cursorElement = buildCharDomElt("");
		domElt.appendChild(this._cursorElement);
		this.positionCursor(0);
	}
	
	/**
	 * Ajoute le caractère devant le curseur.
	 */
	LineDomView.prototype.addChar = function(c) {
		var charElt = buildCharDomElt(c);
		this._domContainer.insertBefore(charElt, this._cursorElement);
	};
	LineDomView.prototype.removeCursor = function(cursorPosition) {
		this._domContainer.children[cursorPosition].style.backgroundColor = "";
	};
	LineDomView.prototype.outputContent = function(content) {
		this._domContainer.innerHTML = content;
	};
	
	LineDomView.prototype.positionCursor = function(cursorIndex) {
		if (this._cursorElement) {
			this._cursorElement.style.backgroundColor = "";
		}
		
		this._cursorElement = this._domContainer.children[cursorIndex];
		this._cursorElement.style.backgroundColor = "yellow";
	};
	
	LineDomView.prototype.removeCharBeforeCursor = function(cursorIndex) {		
		var elementToRemove = this._domContainer.children[cursorIndex - 1];
		this._domContainer.removeChild(elementToRemove);
	};
	
	LineDomView.prototype.scrollIntoTheView = function() {
		this._domContainer.scrollIntoView();
	};
	
	// private
	// -------
	
	function buildCharDomElt(c) {
		if (c === "" || c === " ") {
			c = "&nbsp";
		}
		var charElt = document.createElement("span");
		charElt.innerHTML = c;
		
		return charElt;
	}
	
	return LineDomView;
})();

/**
 * ------------------
 * @class IoLine
 * ------------------
 * Une IoLine permet de lire et d'écrire une ligne de la console.
 * Elle gère le curseur, affiche les caractères tapé par l'utilisateur
 * et lit ce qui a été affiché entre deux pression de la touche "Entrée".
 */
ns_wcons.IoLine = (function(LineDomView) {
	
	// public
	// ------
	
	function IoLine(prefix) {
		this._chars = [];
		this._cursorIndex = 0; // Pointe sur eol.
		this._prefix = prefix ? prefix : "";
		this._domView = null;
		this._consoleDomElement = null;
		this._firstEditableChar = 0;
	}
	
	// Lecture
	
	/**
	 * Retourne ce que l'utilisateur a tapé après le prompt.
	 * @returns {String} La chaine corrspondant à ce que l'utilisateur a tapé
	 * après le prompt.
	 */
	IoLine.prototype.readUserInput = function() {
		var str = "";
		for (var i = this._firstEditableChar; i < this._chars.length; i++) {
			str += this._chars[i];
		}
		
		return str;
	};
	
	// Affichage, édition
	
	IoLine.prototype.addChar = function(character) {
		if (character === "\n") {
			this.moveForward();
			this._firstEditableChar = 0;
		}
		if (character === "\t") {
			addNTimes(this, 4, " ");
		}
		addChar(this, character);
	};
	IoLine.prototype.print = function(str) {
//		clearChars(this);
		for (var i = 0; i < str.length; i++) {
			var char = str[i];
			this.addChar(char);
		}
	};
	IoLine.prototype.printPrompt = function(str) {
		this.print(str);
		this._firstEditableChar = this._chars.length;
	};
	IoLine.prototype.println = function(str) {
		if (typeof str !== "undefined" || str === "") {
			this.print(str);
		}
		this.moveForward();
	};
	IoLine.prototype.removeChar = function() {
		if (this._cursorIndex === 0 || this._cursorIndex === this._firstEditableChar) {
			return;
		}
		this._chars.splice(this._cursorIndex - 1, 1);
		this._domView.removeCharBeforeCursor(this._cursorIndex);
		this._cursorIndex--;
	};
	
	// Déplacements
	
	IoLine.prototype.moveCursorLeft = function() {
		if (this._cursorIndex === 0 || this._cursorIndex === this._firstEditableChar) {
			return;
		}
		this._cursorIndex--;
		this._domView.positionCursor(this._cursorIndex);
	};
	IoLine.prototype.moveCursorRight = function() {
		if (this._cursorIndex > this._chars.length - 1) {
			return;
		}
		this._cursorIndex++;
		this._domView.positionCursor(this._cursorIndex);
	};
	IoLine.prototype.moveCursorToEnd = function() {
		this._cursorIndex = this._chars.length;
		this._domView.positionCursor(this._cursorIndex);
	};
	IoLine.prototype.moveCursorToBeginning = function() {
		this._cursorIndex = this._firstEditableChar;
		this._domView.positionCursor(this._cursorIndex);
	};
	// Abandonne son contenu et avance
	IoLine.prototype.moveForward = function() {
		var prevCursorPosition = this._cursorIndex;
		clearChars(this);
		this._prefix = "";
		addNewDomView(this, prevCursorPosition);
	};
	
	IoLine.prototype.scrollIntoTheView = function() {
		this._domView.scrollIntoTheView();
	};
	
	// ???
	
	IoLine.prototype.appendTo = function(consoleNode) {
		this._consoleDomElement = consoleNode;
		addNewDomView(this);
	};
	
	// private
	// -------
	
	function clearChars(self) {
		self._chars = [];
		self._cursorIndex = 0
	}
	
	function addChar(self, character) {
		self._chars.splice(self._cursorIndex, 0, character);
		self._cursorIndex++;
		self._domView.addChar(character);
	};

	function addNTimes(self, n, character) {
		for (var i = 0; i < n; i++) {
			addChar(self, character)
		}
	};
	
	function addNewDomView(self, cursorPosition) {
		if (self._consoleDomElement === null || typeof self._consoleDomElement === "undefined") {
			throw new Error('consoleDomElement === null || typeof consoleDomElement === "undefined"');
		}
		
		// On retire le curseur de la ligne actuelle qui va devenir la ligne précédente.
		if (self._domView) {
			self._domView.removeCursor(cursorPosition);	
		}
		
		var lineDomElt = document.createElement("div");
		lineDomElt.setAttribute("kind", "iolineview")
		self._domView = new LineDomView(lineDomElt);
		self._consoleDomElement.appendChild(lineDomElt);
	}
	
	return IoLine;	
})(ns_wcons.LineDomView);

/**
 * ------------
 * @class Input
 * ------------
 * Une Input est une chaine qui sait se parser. Elle correspond à une chaine
 * tapée par l'utilisateur.
 * TODO Définir une classe ParsableString qui encapsule cette Input et le 
 * parsetk.
 */
ns_wcons.Input = (function(parseTk) {
	
	/**
	 * @property {string} _str La chaine que l'utilisateur a tapé après
	 * l'invite de commande.
	 */
	function Input(str) {
		this._str = str;
		this._index = str.length > 0 ? 0 : -1;
		this._lastTokenRead = "";
	}
	
	/**
	 * Retourne le premier indice du token passé en paramètre, -1 si on en le
	 * trouve pas.
	 * @param {string} token Le token dont on cherche l'indice.
	 * @returns {int} Le première indice du token cherché si on le trouve, -1
	 * si on ne le trouve pas.
	 * trouve pas.
	 */
	Input.prototype.findTokenIndex = function(token) {
		return parseTk.findTokenIndex(this._str, token);
	};
	
	Input.prototype.readToken = function() {
		if (this.isEmpty()) {
			return "";
		}
		// 1. On récupère le token avec peekToken (qui ne modifie pas la chaine)
		var token = parseTk.peekToken(this._str, this._index);
		// 2. On se place après le token avec skipToken
		var index = parseTk.skipToken(this._str, this._index);
		if (index < 0 || index >= this._str.length) {
			this._index = -1;
		}
		else {
			this._index = index;
		}
		
		this._lastTokenRead = token;
		
		return this._lastTokenRead;
	};

	Input.prototype.lastTokenRead = function() {
		return this._lastTokenRead;
	};
	
	Input.prototype.readChar = function() {
		if (this.isEmpty()) {
			throw new Error("readChar - Empty input");
		}
		
		var character = this._str[this._index];
		this._index++;
		return character;
	};
	
	Input.prototype.oefCode = function() {
		return -1;
	};
	
	Input.prototype.readCharCode = function() {
		var charCode = 0;
		if (this.isEmpty()) {
			charCode = this.oefCode();
		}
		else {
			var character = this._str[this._index];
			this._index++;
			charCode = character.charCodeAt(0);
		}
		return charCode;
	};
	
	/**
	 * Renvoi le contenu d'une ligne (sans le séparateur de ligne).
	 * NOTE C'est au client de gérer les sauts de ligne.
	 * @returns {string} Le contenu de la ligne lue. 
	 */
	Input.prototype.readLine = function() {
		var str = this.readUntil("\n");
		
		// On lit le séparateur de ligne si ce n'est pas la dernière ligne.
		if (! this.isEmpty()) {
			this.readChar();
		}
		
		return str;
	};
	
	/**
	 * Lit l'input jusqu'au caractère passé en paramètre (non compris)
	 * NOTE C'est au client de gérer les sauts de ligne.
	 * @returns {string} Le contenu de la ligne lue. 
	 */
	Input.prototype.readUntil = function(stopChar) {
		var line = "";
		while (! this.isEmpty()) {
			c = this.readChar();
			if (c === stopChar) {
				// On remet le caractère à sa place et on s'en va.
				this._index--;
				break;
			}
			else {
				line += c;
			}
		}
		
		return line;
	};
	
	Input.prototype.isEmpty = function() {
		var res = false;
		if (this._str === "") {
			res = true
		}
		else if (this._index < 0) {
			res = true
		}
		else if (this._index >= this._str.length) {
			res = true;
		}
		
		return res;
	};
	Input.prototype.toString = function() {
		return (this._index >= 0 ? this._str.slice(this._index) : "");
	};
	Input.prototype.skipSpaces = function() {
		var index = parseTk.skipSpaces(this._str, this._index);
		if (index < 0 || index >= this._str.length) {
			this._index = -1;
		}
		else {
			this._index = index;
		}
	};

	return Input;
})(h_parsetk);

ns_wcons.Interpreter = (function(Commands, CommandApi, Input) {
	
	function Interpreter() {
		this._commands = new Commands();
		this._helpCommands = new Commands();
		this._currentCommand = null;
		this._currentInputStr = null;
	}
	Interpreter.prototype.addCommand = function(name, handler) {
		this._commands.add(name, handler)
	};
	Interpreter.prototype.addHelpCommand = function(name, handler) {
		this._helpCommands.add(name, handler);
	};
	Interpreter.prototype.findSortedCommandsNames = function(name, handler) {
		var sortedNames = this._commands.getNamesSorted();
		var names = "";
		sortedNames.forEach(function(nm) {
			names +=nm + ", "; 
		});
		names = names.substring(0, names.length - 2);
		
		return names;
	};
	Interpreter.prototype.hasOneCmdLoaded = function() {
		return this._currentCommand !== null;
	};
	Interpreter.prototype.loadCmd = function(cmdName) {
		var cmd = this._commands.get(cmdName);
		if (!cmd) {
			console.log("Unknow command: " + cmdName);
		}
		else {
			this._currentCommand = this._commands.get(cmdName);
			this._currentInputStr = "";
			console.log("Command loaded: " + cmdName);
		}
	};
	Interpreter.prototype.addToInput = function(str) {
		this._currentInputStr += str;
	};
	Interpreter.prototype.inputString = function() {
		return this._currentInputStr;
	};
	Interpreter.prototype.evalCurrentCmd = function(ioLine) {
		console.log("Evaluatuing command: " + this._currentCommand.getName());
		var input = new Input(this._currentInputStr);
		input.skipSpaces();
		console.log("White spaces skipped");
		this._currentCommand.exec(input, ioLine);
		console.log("Evaluation done.");
		this._currentCommand = null;
	};
	
	return Interpreter;
})(ns_wcons.Commands,  ns_wcons.CommandApi, ns_wcons.Input);

var h_wcons = (function(IoLine, DomOutput, Interpreter, keyboard, Input) {
	
	function buildJConsoleDomElt(id) {
		
		function addIntro(domElt) {
			var helpNode = document.createElement("div");
			helpNode.innerHTML = "Tapez cmdlist pour avoir la liste des commandes comprises par la console.<br />" +
				"Tapez help suivi du nom d'une commande pour avoir de l'aide sur cette commande.";
			domElt.appendChild(helpNode);
		}
		
		var outputElt = document.createElement("div");
		outputElt.setAttribute("id", id);
		
		// Pour écouter les keypress, le div doit d’abord pouvoir recevoir le focus
		outputElt.tabIndex = "1";  // Permet au div de pouvoir recevoir le focus
		
		outputElt.style.fontFamily = "courier";
		outputElt.style.backgroundColor = "lightgrey";
		outputElt.style.width = "100%";
		outputElt.style.height = "20em";
		outputElt.style.overflow = "scroll";
		
		addIntro(outputElt)
		
		return outputElt;
	}
	
	function addKeyboadListener(domElt, ioLine, interpreter, din, doutIoLine, prompt) {
		domElt.addEventListener("keydown", function(event) {
			if (keyboard.isEndOfFile(event)) {
				event.preventDefault();
				console.log("EOF");
				console.log("Interpreter input: " + interpreter.inputString());
				interpreter.evalCurrentCmd(ioLine);
				ioLine.printPrompt(prompt);
			}
			else if (keyboard.isVisibleChar(event) || keyboard.isSpace(event)) {
				ioLine.addChar(event.key);
				interpreter.addToInput(event.key);
			}
			else if (keyboard.isEnter(event)) {
				if (interpreter.hasOneCmdLoaded()) {
					console.log("One cmd loaded");
					interpreter.addToInput("\n");
					ioLine.moveForward();
				}
				else {
					// NOTE(ioLine) ioLine.moveForward() doit être fait après
					// ioLine.readUserInput() car ioLine.readUserInput() lit
					// les caractères de la ligne sur laquelle ioLine pointe.
					// Si on moveForward alors ioLine pointera sur une ligne
					// vide et rien ne sera lu.
					
					// STEP On tente de charger une commande.
					console.log("No cmd loaded");
					var userInputStr = ioLine.readUserInput(); // REF NOTE(ioLine)
					console.log("User input: '" + userInputStr + "'");
					var userInput = new Input(userInputStr);
					var cmdName = userInput.readToken();
					console.log("Command name: '" + cmdName + "'");
					interpreter.loadCmd(cmdName);
					
					// STEP On passe à la ligne.
					ioLine.moveForward(); // REF NOTE(ioLine)
					
					// STEP En cas d'échec on réaffiche un prompt.
					if (! interpreter.hasOneCmdLoaded()) {	
						ioLine.printPrompt(prompt);
					}
				}
			}
			else if (keyboard.isArrowLeft(event)) {
				ioLine.moveCursorLeft();
			}
			else if (keyboard.isArrowRight(event)) {
				ioLine.moveCursorRight();
			}
			else if (keyboard.isBackspace(event)) {
				ioLine.removeChar();
			}
			else if (keyboard.isEnd(event)) {
				event.preventDefault();
				ioLine.moveCursorToEnd();
			}
			else if (keyboard.isHome(event)) {
				event.preventDefault();
				ioLine.moveCursorToBeginning();
			}
		});
	}
	
	return {
		
		/**
		 * Ajoute une console dans l'élément dont l'ID est passé en paramètre.
		 * @param {string} dinId L'id de l'entrée DOM (din = Dom INput).
		 * @param {string} doutId L'id de la sortie DOM (dout = Dom OUTput).
		 * @returns {JConsole} La console qui vient d'être ajoutée au DOM.
		 */
		appendTo: function(id, dinId, doutId) {
			// Création de la console.
			var consolePrompt = "wc> ";
			var consoleDomElt = buildJConsoleDomElt("ns_wcons");
			var consoleIoLine = new IoLine();
			consoleIoLine.appendTo(consoleDomElt);
			var container = document.getElementById(id);
			container.appendChild(consoleDomElt);
			consoleDomElt.focus();
			consoleIoLine.printPrompt(consolePrompt);
			
			// Création des Entrées/Sorties DOM.
			var din = document.getElementById(dinId);
			var dout = document.getElementById(doutId);						
			var doutIoLine = new IoLine();
			doutIoLine.appendTo(dout);
			
			// Création de l'interpréteur.
			var interpreter = new Interpreter();
			
			// Gestion des évènements clavier.
			addKeyboadListener(consoleDomElt, consoleIoLine, interpreter, din, doutIoLine, consolePrompt);
			
			return interpreter;
		}
	}
})(ns_wcons.IoLine, ns_wcons.DomOutput, ns_wcons.Interpreter, h_keyboardtk, ns_wcons.Input);
