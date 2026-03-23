1 Lancer l'application.

```bash
npm i

npx expo start -c

scanner le QR code avec l'application Expo Go sur votre téléphone pour voir l'application en action.

si ca marche pas appuyez sur s pour passer en mode tunnel et réessayez de scanner le QR code.
```

2. Structure du projet.

- `app/`: Contient les écrans de l'application.
- `app/_layout.tsx`: Définit la structure de navigation de l'application.
- `app/index.tsx`: L'écran d'accueil de l'application.
- `app/addDream.tsx`: Modal pour ajouter un rêve.
- `app/editDream.tsx`: Modal pour modifier un rêve.

- `(tabs)/_layout.tsx`: Définit la structure de navigation pour les onglets.
- `(tabs)/index.tsx`: Écran principal affichant la liste des rêves.
- `(tabs)/stats.tsx`: Écran affichant les statistiques des rêves.
- `(tabs)/search.tsx`: Écran de recherche et de filtrages des rêves.
- `(tabs)/add.tsx`: Écran pour ajouter un rêve.

- `components/`: Contient les composants réutilisables de l'application.
- `components/DreamForm.tsx`: Composant pour le formulaire d'ajout et de modification des rêves.
- `components/DreamList.tsx`: Composant pour afficher un rêve dans la liste.
- `components/DreamStorage.tsx`: Composant pour stocker et gérer les données des rêves.

3. Choix de conception.

- Utilisation de Tamagui pour une interface cross-platform fluide et réactive et mise à jour.
- utiliation de gifted-charts pour les stats parce que react-native-svg seul c'est trop verbeux pour faire des graphiques propres, et gifted-charts est bien documenté et maintenu.
- Le formulaire est découpé en 4 étapes parce que le rêve a beaucoup de champs. Tout mettre sur un seul écran c'était illisible. Chaque étape regroupe les infos par thème : quand/quoi, ressenti, contexte, signification.
- Utilisaations de react navigation pour une navigation fluide entre les écrans et les modals. Je l'ai utilisé pour integres le swipe pour fermer les modals, et pour la navigation entre les onglets qui a mes yeux est plus intuitive que de juste cliquer sur l'icone de l'onglet.
- Utilisation de modal pour les écrans d'ajout et de modification des rêves car avec les swipes pour changer de tabs, l'utilisation des sliders dans les formualires etait un peu compliquée. Avec les modals, on peut faire des formulaires plus complexes sans se soucier de la navigation entre les onglets.
- Le filtrage est geré dans un modal pour ne pas surcharger l'écran principal avec des options de filtrage qui ne sont pas utilisées tout le temps. Le modal permet de regrouper toutes les options de filtrage en un seul endroit, ce qui rend l'interface plus propre et plus facile à utiliser.


4. Améliorations possibles.

- les notifications pour se souvenir de noter ses rêves au réveil, ou pour se souvenir de les noter après une sieste.
- l'intégration d'une API de signification des rêves pour suggérer des interprétations
- la possibilité de partager ses rêves avec d'autres utilisateurs ou sur les réseaux sociaux.

et en termes de code :

- decomposer les écrans en composants plus petits pour améliorer la lisibilité et la réutilisabilité du code.
