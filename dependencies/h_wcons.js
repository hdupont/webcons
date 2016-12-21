/**
 * Code d'une console web.
 * 
 * La console
 * ----------
 * Une console (Console) permet d'exécuter des commandes (Command) tapées sur
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
		var cmdReturn = this.executeHandler(api);
		if (cmdReturn === api.quit) {
			this._quitted = true;
		}
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
	LineDomView.prototype.addChar = function(c, cursorIndex) {
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
		clearChars(this);
		for (var i = 0; i < str.length; i++) {
			var char = str[i];
			this.addChar(char);
		}
	};
	IoLine.prototype.printPrompt = function(str) {
		this.print(str);
		this._firstEditableChar = str.length;
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
		if (this._cursorIndex === this._chars.length - 1) {
			return;
		}
		this._cursorIndex++;
		this._domView.positionCursor(this._cursorIndex);
	};
	IoLine.prototype.moveCursorToEnd = function() {
		this._cursorIndex = this._chars.length - 1;
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
		self._domView.addChar(character, this._cursorIndex);
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
		var token = parseTk.peekToken(this._str, this._index);
		
		// On fait pointer this._index sur le caractère qui suit le token lu. 
		// NOTE peekToken ne modifie pas la chaine, donc on commence par se
		// placer sur le premier caractère du token avec skipSpaces.
		var index = parseTk.skipToken(this._str, this._index);
		if (index < 0 || index >= this._str.length) {
			this._index = -1;
		}
		else {
			this._index = index;
		}
		return token;
	};
	
	Input.prototype.readChar = function() {
		if (this.isEmpty()) {
			throw new Error("readChar - Empty input");
		}
		
		var character = this._str[this._index];
		this._index++;
		return character;
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

ns_wcons.Interpreter = (function(Commands, CommandApi) {
	
	function Interpreter() {
		this._commands = new Commands();
		this._helpCommands = new Commands();
		this._currentCommand = null;
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
	Interpreter.prototype.eval = function(input, ioLine) {
		// On lit le nom de la commande et on avance le curseur d'une
		// ligne.
		// NOTE On avance le curseur pour que la commande commence ses
		// affichage sur une ligne vierge. On va lui passer l'ioLine et
		// elle s'en servira pour afficher ce qu'elle veut.
		var cmdName = input.readToken();
		
		// On essaie de charger une commande. Deux cas:
		if (cmdName === "help") {
			// Cas 1. C'est une demande d'aide. Deux cas:
			
			var helpTarget = input.readToken();
			if (helpTarget === "" || helpTarget === "help") {
				// cas a. C'est l'aide générale.
				loadedCommand = this._commands.get("help");
				input = new Input(this.findSortedCommandsNames());
			}
			else {
				// cas b. C'est une aide pour une commande spécifique.
				loadedCommand = this._helpCommands.get(helpTarget);
				
				// On gère le cas où la commande n'a pas d'aide.
				if (typeof loadedCommand === "undefined" || loadedCommand === null) {
					// On va exécuter nohelp.
					loadedCommand = this._commands.get("nohelp");
				}	
			}
		}
		else {
			// Cas 2. C'est une commande en ligne. On la charge.
			loadedCommand = this._commands.get(cmdName);
		}

		// On gère le cas où on n'a pas réussi a charger une commande.
		if (loadedCommand === null) {
			// On va exécuter la commande par défaut.
			loadedCommand = this._commands.getDefaultCommand();
		}
		
		// On gère le cas où la commande chargée est une commande spéciale.
		if (cmdName === "cmdlist") {
			input = new Input(this.findSortedCommandsNames());
		}
		
		// On passe ses arguments à la commande et on lui demande de s'exécuter.
		// NOTE Les arguments de la commande commencent au premier caractère
		// qui ne soit pas un espace après le nom de la commande.
		// NOTE La commande gère ses output. Elle prend la main sur la
		// ioLine pour s'en servire pour afficher ce qu'elle veut.
		input.skipSpaces(); 
		loadedCommand.exec(input, ioLine, this._helpCommands.get(cmdName));
		
		// On fait ce qu'il faut après que la commande a fini de
		// s'exécuter.
		if (loadedCommand.quitted()) {
			var cmdApi = new CommandApi(null, input, ioLine);
		}
	};

	return Interpreter;
})(ns_wcons.Commands,  ns_wcons.CommandApi, ns_wcons.Input);

var h_wcons = (function(Console, IoLine, DomOutput, Interpreter, keyboard, Input) {
	
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
	
	function addKeyboadListener(domElt, ioLine, interpreter, domInputElt, doutIoLine, prompt) {
		domElt.addEventListener("keydown", function(event) {
			if (keyboard.isVisibleChar(event) || keyboard.isSpace(event)) {
				ioLine.addChar(event.key);
			}
			else if (keyboard.isEnter(event)) {
				var io = findIo(ioLine, domInputElt, doutIoLine);
				
				// Une fois les IO déterminées, on passe sur une nouvelle ligne
				// où la commande commencera ses affichages.
				ioLine.moveForward();
				interpreter.eval(io.input, io.output);
				ioLine.printPrompt(prompt);
				ioLine.scrollIntoTheView();
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
	
	/**
	 * Retourne l'entrée utilisateur initialisée depuis l'entrée correspondant
	 * aux options précisée par celui-ci. Les entrées peuvent provenir
	 * directement de la ligne de commande et/ou du DOM.
	 * @param {IoLine} ioLine L'objet permettant d'effectuer les E/S.
	 * @param {HTMLElement} domInputElt L'entrée qui lit depuis le DOM.
	 * @param {IoLine} doutIoLine La sortie qui écrir sur le DOM.
	 * @returns {Input} L'entrée utilisateur utilisable par l'interpréteur
	 * de commande.
	 * NOTE  din = dom input.
	 * TODO Faire le appendTo de ioLine sur le dout et on a tout gratuitement. 
	 */
	function findIo(ioLine, domInputElt, doutIoLine) {
		var io = {input: null, output: null};
		var interpreterInputStr = "";
		var userInputStr = ioLine.readUserInput();
		var tmpInput = new Input(userInputStr);
		h_log.debug("findIo - tmpInput.toString(): " + tmpInput.toString());
		var firstToken = tmpInput.readToken();
		
		// On détermine l'entrée de l'interpréteur.
		// NOTE L'entrée peut provenir de la ligne du commande ou du DOM ou des
		// deux.
		
		// NOTE "<" marque le début des options d'IO.
		if (firstToken === "<") {
			// Cas 1. On lit toute la ligne de commande depuis la source
			// indiquée après le "<".
			
			// On lit le nom de la source de la ligne de commande.
			// NOTE Pour l'instant la seule source est "din"
			tmpInput.readToken();
			// ASSERT Soit le token suivant est ">", soit c'est fini.
			interpreterInputStr = domInputElt.value;
			h_log.info("findIo - Everything from the DOM");
		}
		else {
			// Cas 2. On lit la commande depuit le prompt. Il faut déterminer
			// la source des arguements de la commande.
			var cmdName = firstToken;
			h_log.info("findIo - cmd: " + cmdName);
			
			// On détermine la source des arguements de la commande.
			var cmdArgsSrc = null
			var secondToken = tmpInput.readToken();
			if (secondToken === "<") {
				// Cas 2.1. La source des arguments de la commande est
				// indiquée après le "<"
				
				// On lit le nom de la source des argument de la commande.
				// NOTE En pratique, pour l'instant on supprime le token "din"
				// de l'input
				var dinToken = tmpInput.readToken();
				if (dinToken !== "din") {
					throw new Error("findIo - din token expected.");
				}
				// ASSERT Soit le token suivant est ">", soit c'est fini.
				
				cmdArgsSrc = domInputElt.value;
				h_log.info("findIo - Args from the DOM.");
			}
			else {
				// Cas 2.2. La source est indiquée après le nom de la commande,
				// c'est secondToken;
				var cmdArgsSrc = secondToken;
				// ASSERT Soit le token suivant est ">", soit c'est fini.
				
				h_log.info("findIo - Args from the prompt.");
			}
			
			interpreterInputStr = cmdName + " " + cmdArgsSrc;
		}
		// ASSERT Soit le token suivant est ">", soit c'est fini.

		// On détermine la sortie de l'interpréteur.
		// NOTE La sortie peut s'effectuer dans la console ou dans le DOM.
		
		var output = null;
		var outputMarkToken = tmpInput.readToken();
		h_log.debug("findIo - outputMarkToken: " + outputMarkToken);
		if (outputMarkToken && outputMarkToken === ">") {
			output = doutIoLine;
			h_log.info("findIo - Output to the DOM.");
		}
		else {
			output = ioLine;
			h_log.info("findIo - Output to the console.");
		}
		
		var io = {
				input: new Input(interpreterInputStr),
				output: output
		}
		
		return io;
	}
	
	return {
		
		/**
		 * Ajoute une console dans l'élément dont l'ID est passé en paramètre.
		 * @param {string} dinId L'id de l'entrée DOM (din = Dom INput).
		 * @param {string} doutId L'id de la sortie DOM (dout = Dom OUTput).
		 * @returns {JConsole} La console qui vient d'être ajoutée au DOM.
		 */
		appendTo: function(id, dinId, doutId) {
			var prompt = "wc> ";
			var domInputElt = document.getElementById(dinId);
			var dout = document.getElementById(doutId);
			var consDomElt = buildJConsoleDomElt("ns_wcons");
						
			var doutIoLine = new IoLine();
			doutIoLine.appendTo(dout);
			
			var consoleIoLine = new IoLine();
			consoleIoLine.appendTo(consDomElt);
			
			var interpreter = new Interpreter();
			consoleIoLine.printPrompt(prompt);
			
			addKeyboadListener(consDomElt, consoleIoLine, interpreter, domInputElt, doutIoLine, prompt);
			
			var container = document.getElementById(id);
			container.appendChild(consDomElt);
			
			consDomElt.focus();
			
			return interpreter;
		}
	}
})(ns_wcons.Console, ns_wcons.IoLine, ns_wcons.DomOutput, ns_wcons.Interpreter, h_keyboardtk, ns_wcons.Input);
