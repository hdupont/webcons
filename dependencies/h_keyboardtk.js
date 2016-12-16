/**
 * Boite à outils clavier.
 */
var h_keyboardtk = (function() {
	
	function getCharCode(character) {
		return character.charCodeAt(0);
	}
	
	function codeFromEvent(keyboardEvent) {
		return keyboardEvent.which;
	}
	
	return {
		/**
		 * Indique la touche tapée correspond à un caractère affichable.
		 * @param {int} code Le code de la touche tapée.
		 * @param {string} key Le libellé de la touche tapée.
		 * @returns {boolean} true Si la touche tapée est caractère affichable.
		 * false sinon.
		 * NOTE La touche "Home" a le même code que $, à savoir 36, on est donc
		 * obligé de tester le libellé de la touche en plus de son code.
		 */
		isVisibleChar: function(keyboardEvent) {
			var key = keyboardEvent.key;
			return (key.length === 1) // C'est un caractère. 
				&& (33 <= getCharCode(key) && getCharCode(key) <= 126);
		},
		isSpace: function(keyboardEvent) {
			var code = codeFromEvent(keyboardEvent);
			return code === 32;
		},
		isEnter: function(keyboardEvent) {
			var code = codeFromEvent(keyboardEvent);
			return code === 13;
		},
		isArrowLeft: function(keyboardEvent) {
			var code = codeFromEvent(keyboardEvent);
			return code === 37;
		},
		isArrowRight: function(keyboardEvent) {
			var code = codeFromEvent(keyboardEvent);
			return code === 39;
		},
		isBackspace: function(keyboardEvent) {
			var code = codeFromEvent(keyboardEvent);
			return code === 8;
		},
		isEnd: function(keyboardEvent) {
			var code = codeFromEvent(keyboardEvent);
			return code === 35;
		},
		isHome: function(keyboardEvent) {
			var code = codeFromEvent(keyboardEvent);
			return code === 36;
		}
	};
})();

/*
KeyboardEvent
------------- 
REF Copié/collé Chrome

event: KeyboardEvent
altKey:false
bubbles:true
cancelBubble:false
cancelable:true
charCode:0
code:"KeyD"
composed:true
ctrlKey:false
currentTarget:div#ns_wcons
defaultPrevented:false
detail:0
eventPhase:2
isTrusted:true
key:"d"
keyCode:68
location:0
metaKey:false
path:Array[7]
repeat:false
returnValue:true
shiftKey:false
sourceCapabilities:InputDeviceCapabilities
srcElement:div#ns_wcons
target:div#ns_wcons
timeStamp:1073876.5050000001
type:"keydown"
view:Window
which:68
*/

/*
Ascii
-----
REF
https://fr.wikipedia.org/wiki/American_Standard_Code_for_Information_Interchange

Code en base	Caractère	Signification
10	8	16	2
----------------------------------------
0	0	00	0000000	NUL	Null (nul)
1	01	01	0000001	SOH	Start of Heading (début d'en-tête)
2	02	02	0000010	STX	Start of Text (début de texte)
3	03	03	0000011	ETX	End of Text (fin de texte)
4	04	04	0000100	EOT	End of Transmission (fin de transmission)
5	05	05	0000101	ENQ	Enquiry (demande)
6	06	06	0000110	ACK	Acknowledge (accusé de réception)
7	07	07	0000111	BEL	Bell (sonnerie)
8	010	08	0001000	BS	Backspace (espacement arrière)
9	011	09	0001001	HT	Horizontal Tab (tabulation horizontale)
10	012	0A	0001010	LF	Line Feed (saut de ligne)
11	013	0B	0001011	VT	Vertical Tab (tabulation verticale)
12	014	0C	0001100	FF	Form Feed (saut de page)
13	015	0D	0001101	CR	Carriage Return (retour chariot/retour à la ligne)
14	016	0E	0001110	SO	Shift Out (code spécial)
15	017	0F	0001111	SI	Shift In (code standard)
16	020	10	0010000	DLE	Data Link Escape (échappement en transmission)
17	021	11	0010001	DC1	Device Control 1 à 4 (contrôle de périphérique)
18	022	12	0010010	DC2
19	023	13	0010011	DC3
20	024	14	0010100	DC4
21	025	15	0010101	NAK	Negative Acknowledge (accusé de réception négatif)
22	026	16	0010110	SYN	Synchronous Idle (attente synchronisée)
23	027	17	0010111	ETB	End of Transmission Block (fin de bloc de transmission)
24	030	18	0011000	CAN	Cancel (annulation)
25	031	19	0011001	EM	End of Medium (fin de support)
26	032	1A	0011010	SUB	Substitute (remplacement)
27	033	1B	0011011	ESC	Escape (échappement)
28	034	1C	0011100	FS	File Separator (séparateur de fichier)
29	035	1D	0011101	GS	Group Separator (séparateur de groupe)
30	036	1E	0011110	RS	Record Separator (séparateur d'enregistrement)
31	037	1F	0011111	US	Unit Separator (séparateur d'unité)
32	040	20	0100000	SP	Space (espacement)
33	041	21	0100001	 !	Point d'exclamation
34	042	22	0100010	"	Guillemet
35	043	23	0100011	#	Croisillon8
36	044	24	0100100	$	Dollar
37	045	25	0100101	 %	Pourcent
38	046	26	0100110	&	Esperluette8
39	047	27	0100111	'	Apostrophe12
40	050	28	0101000	(	Parenthèse ouvrante
41	051	29	0101001	)	Parenthèse fermante
42	052	2A	0101010	*	Astérisque
43	053	2B	0101011	+	Plus
44	054	2C	0101100	,	Virgule
45	055	2D	0101101	-	Trait d'union, moins8
46	056	2E	0101110	.	Point
47	057	2F	0101111	/	Barre oblique
48	060	30	0110000	0	Chiffre zéro
49	061	31	0110001	1	Chiffre un
50	062	32	0110010	2	Chiffre deux
51	063	33	0110011	3	Chiffre trois
52	064	34	0110100	4	Chiffre quatre
53	065	35	0110101	5	Chiffre cinq
54	066	36	0110110	6	Chiffre six
55	067	37	0110111	7	Chiffre sept
56	070	38	0111000	8	Chiffre huit
57	071	39	0111001	9	Chiffre neuf
58	072	3A	0111010	 :	Deux-points
59	073	3B	0111011	 ;	Point-virgule
60	074	3C	0111100	<	Inférieur
61	075	3D	0111101	=	Égal
62	076	3E	0111110	>	Supérieur
63	077	3F	0111111	 ?	Point d'interrogation
64	0100	40	1000000	@	Arobase8
65	0101	41	1000001	A	Lettre latine capitale A
66	0102	42	1000010	B	Lettre latine capitale B
67	0103	43	1000011	C	Lettre latine capitale C
68	0104	44	1000100	D	Lettre latine capitale D
69	0105	45	1000101	E	Lettre latine capitale E
70	0106	46	1000110	F	Lettre latine capitale F
71	0107	47	1000111	G	Lettre latine capitale G
72	0110	48	1001000	H	Lettre latine capitale H
73	0111	49	1001001	I	Lettre latine capitale I
74	0112	4A	1001010	J	Lettre latine capitale J
75	0113	4B	1001011	K	Lettre latine capitale K
76	0114	4C	1001100	L	Lettre latine capitale L
77	0115	4D	1001101	M	Lettre latine capitale M
78	0116	4E	1001110	N	Lettre latine capitale N
79	0117	4F	1001111	O	Lettre latine capitale O
80	0120	50	1010000	P	Lettre latine capitale P
81	0121	51	1010001	Q	Lettre latine capitale Q
82	0122	52	1010010	R	Lettre latine capitale R
83	0123	53	1010011	S	Lettre latine capitale S
84	0124	54	1010100	T	Lettre latine capitale T
85	0125	55	1010101	U	Lettre latine capitale U
86	0126	56	1010110	V	Lettre latine capitale V
87	0127	57	1010111	W	Lettre latine capitale W
88	0130	58	1011000	X	Lettre latine capitale X
89	0131	59	1011001	Y	Lettre latine capitale Y
90	0132	5A	1011010	Z	Lettre latine capitale Z
91	0133	5B	1011011	[	Crochet ouvrant
92	0134	5C	1011100	\	Barre oblique inversée
93	0135	5D	1011101	]	Crochet fermant
94	0136	5E	1011110	^	Accent circonflexe (avec chasse)
95	0137	5F	1011111	_	Tiret bas8
96	0140	60	1100000	`	Accent grave (avec chasse)13
97	0141	61	1100001	a	Lettre latine minuscule a
98	0142	62	1100010	b	Lettre latine minuscule b
99	0143	63	1100011	c	Lettre latine minuscule c
100	0144	64	1100100	d	Lettre latine minuscule d
101	0145	65	1100101	e	Lettre latine minuscule e
102	0146	66	1100110	f	Lettre latine minuscule f
103	0147	67	1100111	g	Lettre latine minuscule g
104	0150	68	1101000	h	Lettre latine minuscule h
105	0151	69	1101001	i	Lettre latine minuscule i
106	0152	6A	1101010	j	Lettre latine minuscule j
107	0153	6B	1101011	k	Lettre latine minuscule k
108	0154	6C	1101100	l	Lettre latine minuscule l
109	0155	6D	1101101	m	Lettre latine minuscule m
110	0156	6E	1101110	n	Lettre latine minuscule n
111	0157	6F	1101111	o	Lettre latine minuscule o
112	0160	70	1110000	p	Lettre latine minuscule p
113	0161	71	1110001	q	Lettre latine minuscule q
114	0162	72	1110010	r	Lettre latine minuscule r
115	0163	73	1110011	s	Lettre latine minuscule s
116	0164	74	1110100	t	Lettre latine minuscule t
117	0165	75	1110101	u	Lettre latine minuscule u
118	0166	76	1110110	v	Lettre latine minuscule v
119	0167	77	1110111	w	Lettre latine minuscule w
120	0170	78	1111000	x	Lettre latine minuscule x
121	0171	79	1111001	y	Lettre latine minuscule y
122	0172	7A	1111010	z	Lettre latine minuscule z
123	0173	7B	1111011	{	Accolade ouvrante
124	0174	7C	1111100	|	Barre verticale
125	0175	7D	1111101	}	Accolade fermante
126	0176	7E	1111110	~	Tilde
127	0177	7F	1111111	DEL	Delete (effacement)
*/
