// Code dont le but est de proposer à l'utilisateur un simulacre de console
// dans son navigateur web.

// Namespace de l'application.
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
	
	function CommandApi(cmd, input, ioLine, helpCmd) {
		this._cmd = cmd;
		this._input = input;
		this._ioLine = ioLine;
		this._helpCmd = helpCmd;
	}
	CommandApi.prototype.print = function(cmdOutput) {
		this._ioLine.print(cmdOutput);
	};
	CommandApi.prototype.println = function(cmdOutput) {
		this._ioLine.println(cmdOutput);
	};
	CommandApi.prototype.input = function() {
		return this._input;
	};
	CommandApi.prototype.inputString = function() {
		return this._input.toString();
	};
	CommandApi.prototype.args = function() {
		// On saute le premier token qui est le prompt, d'où le 1.
		return this._input.peekAfterToken(1);
	};
	CommandApi.prototype.peekInputAfterToken = function(index) {
		return this._input.peekAfterToken(index);
	}
	CommandApi.prototype.inlineCmdArgsString = function(index) {
		// On saute les deux premiers tokens. Le premier token est le prompt
		// et le deuxième token est le nom de la commande, d'où le 2.
		return this._input.peekAfterToken(2); 
	}
	CommandApi.prototype.exit = function() {
		throw new CommandExitException("Argument cannot be less than zero");
	}
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
	CommandApi.prototype.cmdName = function() {
		return this._cmd.getName();
	}
	CommandApi.prototype.quit = "quit";
	
	return CommandApi;
})(ns_wcons.CommandExitException);

/**
 * --------------
 * @class Command
 * --------------
 * Une Command est une commande que la console peut exécuter.
 * Il y a deux types de commandes:
 * 1. les commandes en lignes
 * 2. les commandes interactives. 
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
		else {
			this.postReturnCheck(api);
		}
	};
	Command.prototype.executeHandler = function(api) {
		var cmdReturn = this._handler(api);		
	};
	/**
	 * Rien par défaut.
	 * A coder spécifiquement pour les commandes en ayant besoin.
	 * Par exemple pour les commandes interactive.
	 */
	Command.prototype.postReturnCheck = function(api) {
		// Rien 		
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
 * -------------------------
 * @class InteractiveCommand
 * -------------------------
 * Une InteractiveCommand est une commande que prend la main sur le prompt.
 * Il faut quitter la commande pour repasser la main à la console. 
 * NOTE Par convention le nom des InteractiveCommand est suffixé par un "i"
 * (comme "interactive"). 
 */
ns_wcons.InteractiveCommand = (function(Command) {
	
	function InteractiveCommand(name, handler) {
		Command.call(this, name, handler);
		this._isFirstExecution = true;
		this._quitted = false;
	}
	InteractiveCommand.prototype = new Command();
	
	InteractiveCommand.prototype.getPrompt = function(api) {
		return this.getName() + "> ";
	};
	InteractiveCommand.prototype.executeHandler = function(api) {
		// Si c'est la première exécution, on affiche le message de bienvenue
		// et on s'en retourne.
		if (this._isFirstExecution || this._quitted) {
			this._isFirstExecution = false;
			this._quitted = false;
			api.println(this.getIntroduction());
			api.printPrompt();
			return;
		}
		
		return this._handler(api);
	};
	InteractiveCommand.prototype.postReturnCheck = function(api) {
		api.print(this.getPrompt());	
	};
	InteractiveCommand.prototype.getCmdArgsString = function(input) {
		return input.getInputString();
	};
	
	return InteractiveCommand;
})(ns_wcons.Command);

/**
 * ---------------
 * @class Commands
 * ---------------
 * Une Commands est une liste de Command (en ligne ou interactives).  
 */
ns_wcons.Commands = (function(InlineCommand, InteractiveCommand) {
	
	function Commands() {
		this._commands = [];
	}
	Commands.prototype.add = function(name, handler) {
		var inlineCmd = new InlineCommand(name, handler);
		this._commands.push(inlineCmd);
	};
	Commands.prototype.addInteractiveCommand = function(name, handler) {
		var interactiveCmd = new InteractiveCommand(name, handler);
		this._commands.push(interactiveCmd);
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
})(ns_wcons.InlineCommand, ns_wcons.InteractiveCommand);

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
	
	IoLine.prototype.readLine = function() {	
		var str = this._chars.map(function(consChar) {
			return consChar.getChar();
		}).join("");
		
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
 */
ns_wcons.Input = (function(parseTk) {
	
	function Input(str) {
		this._str = str;
	}
	Input.prototype.peekAfterToken = function(index) {
		return parseTk.peekAfterToken(this._str, index);
	};
	Input.prototype.findToken = function(index, start) {
		return parseTk.findToken(this._str, index, start);
	};
	Input.prototype.readToken = function() {
		var token = this.peekToken(0);
		var index = parseTk.skipSpaces(this._str, token.length);
		this._str = this._str.slice(index);
		return token;
	};
	Input.prototype.toString = function() {
		return this._str;
	};

	return Input;
})(h_parsetk);

/**
 * --------------
 * @class Console
 * --------------
 * Une Console est un simulacre de console dans laquelle l'utilisateur peut
 * exécuter des commandes.
 */
ns_wcons.Console = (function(Input, keyboard, Commands, CommandApi) {
	
	// public
	// ------

	function Console(ioLine) {
		this._domElt = null; // Un singleton.
		this._commands = new Commands();
		this._interactiveCommands = new Commands();
		this._helpCommands = new Commands();
		this._currentCommand = null;
		this._currentInteractiveCommand = null;
		this._prompt = "wc>";
		this._ioLine = ioLine;
		this._input = null;
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
	Console.prototype.printPrompt = function() {
		this._ioLine.printPrompt(this._prompt + " ");
	};
	Console.prototype.moveCursorLeft = function() {
		this._ioLine.moveLeft();
	};
	Console.prototype.moveCursorRight = function() {
		this._ioLine.moveRight();
	};
	Console.prototype.deleteCharFromLine = function() {
		this._ioLine.deleteChar();
	};
	Console.prototype.print = function(str) {
		this._ioLine.print(str);
	};
	Console.prototype.println = function(str) {
		this._ioLine.println(str);
	};
	Console.prototype.addInlineCommand = function(name, handler) {
		this._commands.add(name, handler, false);
	};
	Console.prototype.addInteractiveCommand = function(name, handler) {
		this._interactiveCommands.addInteractiveCommand(name, handler);
	};
	Console.prototype.addHelpCommand = function(name, handler) {
		this._helpCommands.add(name, handler);
	};
	Console.prototype.isInlineCmd = function(name) {
		var cmd = this._commands.get(name)
		return cmd != null;
	};
	Console.prototype.isInteractiveCmd = function(name) {
		var cmd = this._interactiveCommands.get(name);
		return cmd;
	};
	Console.prototype.findSortedCommandsNames = function(name, handler) {
		var sortedNames = this._commands.getNamesSorted();
		var names = "";
		sortedNames.forEach(function(nm) {
			names +=nm + ", "; 
		});
		names = names.substring(0, names.length - 2);
		
		return names;
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
		var sortedCmds = self._commands.getNamesSorted();
		var sortedCmdsStr = sortedCmds.join(", ");
		var helpNode = document.createElement("div");
		helpNode.innerHTML = "Tapez cmdlist pour avoir la liste des commandes comprises par la console.<br />" +
			"Tapez help suivi du nom d'une commande pour avoir de l'aide sur cette commande.";
		self._domElt.appendChild(helpNode);
	}
	function addKeyboadListener(that) {
		that._domElt.addEventListener("keydown", function(event) {
			if (keyboard.isVisibleChar(event.keyCode, event.key) || keyboard.isSpace(event.keyCode)) {
				that._ioLine.addInputChar(event.key);
			}
			else if (keyboard.isEnter(event.keyCode)) {
				// On lit le nom de la commande et on avance le curseur d'une
				// ligne.
				// NOTE On avance le curseur pour que la commande commence ses
				// affichage sur une ligne vierge. On va lui passer l'ioLine et
				// elle s'en servira pour afficher ce qu'elle veut.
				var inputStr = that._ioLine.readLine();
				var input = new Input(inputStr);
				var cmdName = input.findToken(1, that._prompt.length); // Le premier étant le prompt.
				that._ioLine.moveForward();
				
				var loadedCommand = null;
				
				// On regarde d'abord s'il y a une commande interactive en
				// cours d'exécution. Deux cas:
				if (that._currentInteractiveCommand !== null && that._currentInteractiveCommand.quitted()) {
					// Cas 1. Il y a en avait une mais elle a fini de
					// s'exécuter. On la "décharge".
					
					that._currentInteractiveCommand = null;
				}
				else {
					// Cas 2. Il y a en une mais elle n'a pas fini de
					// s'exécuter. Elle continue.
					
					loadedCommand = that._currentInteractiveCommand;
				}
				
				// S'il n'a y a pas de commande interactive en cours. On essaie
				// de charger une commande. Trois cas:
				if (loadedCommand === null) {
					if (cmdName === "help") {
						// Cas 1. C'est une demande d'aide. Deux cas:
						
						var helpTarget = input.findToken(2, that._prompt.length);
						if (helpTarget === "" || helpTarget === "help") {
							// cas a. C'est l'aide générale.
							
							loadedCommand = that._helpCommands.get("help");
							input = new Input(that.findSortedCommandsNames());
						}
						else {
							// cas b. C'est une aide pour une commande spécifique.
							
							loadedCommand = that._helpCommands.get(helpTarget);
							
							// On gère le cas où la commande n'a pas d'aide.
							if (typeof loadedCommand === "undefined" || loadedCommand === null) {
								// On va exécuter nohelp.
								loadedCommand = that._commands.get("nohelp");
							}	
						}
					}
					else if (that.isInlineCmd(cmdName)) {
						// Cas 2. C'est une commande en ligne. On la charge.
						
						loadedCommand = that._commands.get(cmdName);
					}
					else if (that.isInteractiveCmd(cmdName)) {
						// Cas 3. C'est une commande interactive.  On la charge.
						
						loadedCommand = that._interactiveCommands.get(cmdName);
						that._currentInteractiveCommand = loadedCommand;
					}
				}

				// On gère le cas où on n'a pas réussi a charger une commande.
				if (loadedCommand === null) {
					// On va exécuter la commande par défaut.
					loadedCommand = that._commands.getDefaultCommand();
				}
				
				// On gère le cas où la commande chargée est une commande spéciale.
				if (cmdName === "cmdlist") {
					input = new Input(that.findSortedCommandsNames());
				}
				
				// NOTE La commande gère ses output. Elle prend la main sur la
				// ioLine pour s'en servire pour afficher ce qu'elle veut.
				loadedCommand.onInput(input, that._ioLine, that._helpCommands.get(cmdName));
				
				// On fait ce qu'il faut après que la commande a fini de
				// s'exécuter.
				if (loadedCommand.quitted()) {
					that._currentInteractiveCommand = null;
					var cmdApi = new CommandApi(null, input, that._ioLine);
					that.printPrompt();
				}
			}
			else if (keyboard.isArrowLeft(event.keyCode)) {
				that._ioLine.moveCursorLeft();
			}
			else if (keyboard.isArrowRight(event.keyCode)) {
				that._ioLine.moveCursorRight();
			}
			else if (keyboard.isBackspace(event.keyCode)) {
				that._ioLine.removeChar();
			}
			else if (keyboard.isEnd(event.keyCode)) {
				that._ioLine.moveCursorToEnd();
			}
			else if (keyboard.isHome(event.keyCode)) {
				that._ioLine.moveCursorToBeginning();
			}
		});
	}

	return Console;
})(ns_wcons.Input, h_keyboardtk, ns_wcons.Commands, ns_wcons.CommandApi);

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
			jcons.printPrompt();
			
			var container = document.getElementById(id);
			container.appendChild(jconsDomElt);
			
			jconsDomElt.focus();
			
			return jcons;
		}
	}
})(ns_wcons.Console, ns_wcons.IoLine);
