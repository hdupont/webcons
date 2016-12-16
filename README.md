# webcons

Une console web

https://hdupont.github.io/webcons/

Tapez `cmdlist` pour avoir la liste des commandes comprises par la console.

Tapez `help` suivi du nom d'une commande pour avoir de l'aide sur cette commande.
  
## La console

Une console (Console) permet d'exécuter des commandes (Command) tapées sur une ligne de commandes (IoLine) après que l'utilisateur ait appuyé sur la touche "Entrée".
Les commandes comprises par la console se trouvent dans une liste (Commands).
La console met à disposition de ses commandes la ligne tapée par l'utilisateur (Input) ainsi qu'un moyen de procéder à des affichages (IoLine). 
 
## Les commandes
 
Une commande peut exécuter les instructions mises à sa dispostion dans l'api des commandes (CommandApi).
Il y a deux types de commandes :

1. les commandes interactivent (InteractiveCommand)

2. les commandes en ligne (InlineCommand)

Une commande interactive prend la main sur la console et s'exécute dans son propre environnement. Il faut les quitter pour retourner dans la console. Une commande en ligne ne prend pas la main sur la console et il n'est pas nécessaire de la quitter. Elle effectue son traitement et redonne immédiatement la main à la console.
 
##  Les Entrées/Sorties

L'utilisateur tape une suite de caractères (Character) sur la ligne de  commande (IoLine) qui délègue l'affichage à sa vue (LineDomView). La ligne de commande est équipée d'un curseur et est éditable, l'utilisateur peut déplacer le curseur et procéder à des ajouts ou des suppression de caractères au niveau du curseur.
