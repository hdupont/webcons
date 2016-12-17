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
 * L'utilisateur tape une suite de caractères (Character) sur la ligne de 
 * commande (IoLine) qui délègue l'affichage à sa vue (LineDomView).
 * La ligne de commande est équipée d'un curseur et est éditable, l'utilisateur
 * peut déplacer le curseur et procéder à des ajouts ou des suppression de
 * caractères au niveau du curseur.
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
	Command.prototype.onInput = function(input, ioLine, helpCmd) {
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
 * --------------------
 * @class InlineCommand
 * --------------------
 * Une InlineCommand est une commande qui retourne immédiatement un résultat
 * (affiché par la console) et qui repasse la main à la console. 
 */
ns_wcons.InlineCommand = (function(Command) {
	function InlineCommand(name, handler) {
		Command.call(this, name, handler);
	}
	InlineCommand.prototype = new Command();
	
	return InlineCommand
})(ns_wcons.Command);

/**
 * ---------------
 * @class Commands
 * ---------------
 * Une Commands est une liste de Command.  
 */
ns_wcons.Commands = (function(InlineCommand) {
	
	function Commands() {
		this._commands = [];
	}
	Commands.prototype.add = function(name, handler) {
		var inlineCmd = new InlineCommand(name, handler);
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
})(ns_wcons.InlineCommand);

/**
 * ----------------
 * @class Character
 * ----------------
 * Un Character représente un caractère tapé par l'utilisateur.
 */
ns_wcons.Character = (function() {
	
	// public
	// ------
	
	function Character(character) {
		this._character = character;
		this._isEol = false;
	}
	Character.prototype.getChar = function() {
		return this._character ? this._character: "";
	};
	Character.createEolChar = function() {
		var eol = new Character(); // un espace
		eol._isEol = true;
		return eol;
	}
	
	return Character;	
})();

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
	
	function LineDomView(domElt) {
		this._domContainer = domElt;
		this._prefix = "";
		
	}
	LineDomView.prototype.updateLine = function(chars, cursorIndex, prefix) {
		this._domContainer.innerHTML = prefix ? prefix : "";
		
		var self = this;
		chars.forEach(function(consChar, index) {
			var c = consChar.getChar();
			if (c === "" || c === " ") {
				c = "&nbsp";
			}
			domElt = buildCharDomElt(self, c, index === cursorIndex);
			self._domContainer.appendChild(domElt);
		});
		this._domContainer.scrollIntoView();
		
	};
	LineDomView.prototype.addChar = function(c) {
		var domElt = buildCharDomElt(self, c);
		this._domContainer.appendChild(domElt);
	};
	LineDomView.prototype.removeCursor = function(cursorPosition) {
		this._domContainer.children[cursorPosition].style.backgroundColor = "";
	};
	LineDomView.prototype.outputContent = function(content) {
		this._domContainer.innerHTML = content;
	};
	
	// private
	// -------
	
	function buildCharDomElt(that, character, isUnderCursor) {
		var charElt = document.createElement("span");
		charElt.innerHTML = character;
		
		if (isUnderCursor) {
			charElt.style.backgroundColor = "yellow";
		}
		
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
ns_wcons.IoLine = (function(Character, LineDomView) {
	
	// public
	// ------
	
	function IoLine(prefix) {
		var eol = Character.createEolChar();
		
		this._chars = [eol];
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
		for (var i = this._firstEditableChar; i < this._chars.length - 1; i++) {
			var consChar = this._chars[i];
			str += consChar.getChar();
		}
		
		return str;
	};
	
	// Affichage
	
	IoLine.prototype.addInputChar = function(character) {
		addChar(this, character);
		updateWithInputChars(this);
	};
	IoLine.prototype.addOutputChar = function(character) {
		addChar(this, character);
		updateWithInputChars(this);
	};
	IoLine.prototype.print = function(str) {
		clearChars(this);
		var chars = [Character.createEolChar()];
		for (var i = 0; i < str.length; i++) {
			var char = str[i];
			this.addOutputChar(char);
		}
	};
	IoLine.prototype.printPrompt = function(str) {
		this.print(str);
		this._firstEditableChar = str.length;
	};
	IoLine.prototype.println = function(str) {
		this.print(str);
		this.moveForward();
	};
	
	// Mouvements et édition
	
	IoLine.prototype.moveCursorLeft = function() {
		if (this._cursorIndex === 0 || this._cursorIndex === this._firstEditableChar) {
			return;
		}
		this._cursorIndex--;
		updateWithInputChars(this);
	};
	IoLine.prototype.moveCursorRight = function() {
		if (this._cursorIndex === this._chars.length - 1) {
			return;
		}
		this._cursorIndex++;
		updateWithInputChars(this);
	};
	IoLine.prototype.removeChar = function() {
		if (this._cursorIndex === 0 || this._cursorIndex === this._firstEditableChar) {
			return;
		}
		this._chars.splice(this._cursorIndex - 1, 1);
		this._cursorIndex--;
		updateWithInputChars(this);
	};
	IoLine.prototype.moveCursorToEnd = function() {
		this._cursorIndex = this._chars.length - 1;
		updateWithInputChars(this);
	};
	IoLine.prototype.moveCursorToBeginning = function() {
		this._cursorIndex = this._firstEditableChar;
		this._domView.updateLine(this);
	};
	// Abandonne son contenu et avance
	IoLine.prototype.moveForward = function() {
		var prevCursorPosition = this._cursorIndex;
		clearChars(this);
		this._prefix = "";
		addNewDomView(this, prevCursorPosition);
	};
	
	// ???
	
	IoLine.prototype.appendTo = function(consoleNode) {
		this._consoleDomElement = consoleNode;
		addNewDomView(this);
	};
	IoLine.prototype.onCursorUpdate = function(character) {
		// TODO
		// plutot que d'appeller directement la vue dans addChar,
		// on l'inscrit ici à l'événement addChar
	};
	
	// private
	// -------
	
	function clearChars(self) {
		while(self._chars.length > 1) {
			self._chars.shift();
		}
		self._cursorIndex = 0
	}
	
	function addChar(self, character) {
		self._chars.splice(self._cursorIndex, 0, new Character(character));
		self._cursorIndex++;
	};
	
	function updateWithInputChars(self) {
		self._domView.updateLine(self._chars, self._cursorIndex, self._prefix);
	}

	function updateWithOutputChars(chars) {
		self._domView.updateLine(chars, self._cursorIndex, "");
	}
	
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
		updateWithInputChars(self);
	}
	
	return IoLine;	
})(ns_wcons.Character, ns_wcons.LineDomView);

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
	}
	Input.prototype.findToken = function(index, start) {
		return parseTk.findToken(this._str, index, start);
	};
	Input.prototype.readToken = function() {
		var token = parseTk.peekToken(this._str, 0);
		var index = parseTk.skipSpaces(this._str, token.length);
		this._str = this._str.slice(index);
		return token;
	};
	Input.prototype.readChar = function() {
		var char = this._str.substr(0,1);
		this._str = this._str.slice(1);
		return char;
	};
	Input.prototype.isEmpty = function() {
		return this._str.length === 0;
	};
	Input.prototype.toString = function() {
		return this._str;
	};

	return Input;
})(h_parsetk);

ns_wcons.Interpreter = (function(Commands, CommandApi, Input) {
	
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
	Interpreter.prototype.isInlineCmd = function(name) {
		var cmd = this._commands.get(name)
		return cmd != null;
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
	Interpreter.prototype.eval = function(inputStr, ioLine, prompt) {
		// On lit le nom de la commande et on avance le curseur d'une
		// ligne.
		// NOTE On avance le curseur pour que la commande commence ses
		// affichage sur une ligne vierge. On va lui passer l'ioLine et
		// elle s'en servira pour afficher ce qu'elle veut.
		var input = new Input(inputStr);
		
		var cmdName = input.readToken();
		ioLine.moveForward();
		
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
		else if (this.isInlineCmd(cmdName)) {
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
		
		// NOTE La commande gère ses output. Elle prend la main sur la
		// ioLine pour s'en servire pour afficher ce qu'elle veut.
		loadedCommand.onInput(input, ioLine, this._helpCommands.get(cmdName));
		
		// On fait ce qu'il faut après que la commande a fini de
		// s'exécuter.
		if (loadedCommand.quitted()) {
			var cmdApi = new CommandApi(null, input, ioLine);
			ioLine.printPrompt(prompt);
		}
	};

	return Interpreter;
})(ns_wcons.Commands,  ns_wcons.CommandApi, ns_wcons.Input);

/**
 * --------------
 * @class Console
 * --------------
 * Une Console est un simulacre de console dans laquelle l'utilisateur peut
 * exécuter des commandes.
 */
ns_wcons.Console = (function(keyboard, Interpreter) {
	
	// public
	// ------

	function Console(ioLine) {
		this._domElt = null; // Un singleton.		
		this._prompt = "wc> ";
		this._ioLine = ioLine;
		this._input = null;
		this._interpreter = new Interpreter();
	}
	
	Console.prototype.getDomElt = function() {
		if (this._domElt !== null) {
			return this._domElt;
		}

		this._domElt = buildJConsoleDomElt(this);
		addIntro(this);
		this._ioLine.appendTo(this._domElt);
		addKeyboadListener(this);

		return this._domElt;
	};
	
	// Affichage
	
	Console.prototype.getPrompt = function(prompt) {
		return this._prompt;
	};
	
	// Commandes
	
	Console.prototype.addCommand = function(name, handler) {
		this._interpreter.addCommand(name, handler, false);
	};
	Console.prototype.addHelpCommand = function(name, handler) {
		this._interpreter.addHelpCommand(name, handler);
	};
	
	// private
	// -------
	
	function buildJConsoleDomElt(that) {
		var outputElt = document.createElement("div");
		outputElt.setAttribute("id", "ns_wcons");
		
		// Pour écouter les keypress, le div doit d’abord pouvoir recevoir le focus
		outputElt.tabIndex = "1";  // Permet au div de pouvoir recevoir le focus
		
		outputElt.style.fontFamily = "courier";
		outputElt.style.backgroundColor = "lightgrey";
		outputElt.style.width = "100%";
		outputElt.style.height = "20em";
		outputElt.style.overflow = "scroll";
		
		return outputElt;
	}
	function addIntro(self) {
		var helpNode = document.createElement("div");
		helpNode.innerHTML = "Tapez cmdlist pour avoir la liste des commandes comprises par la console.<br />" +
			"Tapez help suivi du nom d'une commande pour avoir de l'aide sur cette commande.";
		self._domElt.appendChild(helpNode);
	}
	function addKeyboadListener(that) {
		that._domElt.addEventListener("keydown", function(event) {
			if (keyboard.isVisibleChar(event) || keyboard.isSpace(event)) {
				that._ioLine.addInputChar(event.key);
			}
			else if (keyboard.isEnter(event)) {
				var inputStr = that._ioLine.readUserInput();
				that._interpreter.eval(inputStr, that._ioLine, that._prompt);
			}
			else if (keyboard.isArrowLeft(event)) {
				that._ioLine.moveCursorLeft();
			}
			else if (keyboard.isArrowRight(event)) {
				that._ioLine.moveCursorRight();
			}
			else if (keyboard.isBackspace(event)) {
				that._ioLine.removeChar();
			}
			else if (keyboard.isEnd(event)) {
				// TODO
				// that._ioLine.moveCursorToEnd();
			}
			else if (keyboard.isHome(event)) {
				// TODO
				// that._ioLine.moveCursorToBeginning();
			}
		});
	}

	return Console;
})(h_keyboardtk, ns_wcons.Interpreter);

// API
// TODO faire que ns_wcons utilise webconns, avec ns = namespace pour plus de clareté.
// })(webconns.Console, ns_wcons);
var h_wcons = (function(Console, IoLine) {
	return {
		/**
		 * Ajoute une console dans l'élément dont l'ID est passé en paramètre.
		 * @returns {JConsole} La console qui vient d'être ajoutée au DOM.
		 */
		appendTo: function(id) {
			var ioLine = new IoLine();
			
			var jcons = new Console(ioLine);
			jconsDomElt = jcons.getDomElt();
			ioLine.printPrompt(jcons.getPrompt());
			
			var container = document.getElementById(id);
			container.appendChild(jconsDomElt);
			
			jconsDomElt.focus();
			
			return jcons;
		}
	}
})(ns_wcons.Console, ns_wcons.IoLine);
