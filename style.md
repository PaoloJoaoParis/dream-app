# Documentation du Style de l'Application (App Design System)

Ce document décrit les choix stylistiques, la palette de couleurs et les composants d'interface de l'application "Mon App Tamagui" (Journal de Rêves).

## 1. Stack Technique & Outils
*   **Framework Principal :** React Native (Expo)
*   **Système de Design :** Tamagui (`@tamagui/config/v5`)
*   **Effets Visuels :** `expo-blur` (Glassmorphism)
*   **Graphiques :** `react-native-gifted-charts`
*   **Icônes :** Lucide Icons (via Tamagui)
*   **Thème :** Dark Mode (Thème sombre profond)

## 2. Palette de Couleurs (Dark Theme)

L'application utilise un thème sombre immersif avec des accents violets et pêche.

### Fond & Surfaces
| Usage | Valeur Hex | Description |
| :--- | :--- | :--- |
| **Background Principal** | `#080810` | Bleu nuit très sombre, presque noir. Utilisé sur tous les écrans. |
| **Glass Card Background** | `rgba(255,255,255,0.055)` | Translucide pour l'effet de verre. |
| **Glass Border** | `rgba(157,127,234,0.18)` | Bordure subtile violette. |
| **Glass Top Border** | `rgba(255,255,255,0.10)` | Reflet lumineux sur le bord supérieur. |

### Typographie
| Usage | Valeur Hex | Style |
| :--- | :--- | :--- |
| **Titres (Headings)** | `#EEE8FF` | Blanc cassé / Lavande très clair. |
| **Corps de texte** | `#CCC6E8` | Gris-violet clair. |
| **Sous-titres / Labels** | `#7A738C` | Gris-violet moyen (Muted). |

### Accents & Vizualisation de Données
Ces couleurs sont utilisées pour les graphiques, les badges et les éléments interactifs.
*   **Primaire (Violet)** : `#9D7FEA`
*   **Secondaire (Pêche)** : `#F0A070`
*   **Tertiaire (Email)** : `#B89FF5`
*   **Neutre Sombre** : `#5A5370`

## 3. Typographie

*   **Titres :** `fontWeight: "700"`, `letterSpacing: -0.4`. Moderne et gras.
*   **Sous-titres (Eyebrow) :** `textTransform: "uppercase"`, `fontSize: 11`, `letterSpacing: 1.5`. Utilisé pour les catégories (ex: "JOURNAL", "STATISTIQUES").
*   **Corps :** Lisible, avec un bon contraste sur le fond sombre.

## 4. Composants UI & Glassmorphism

L'identité visuelle repose sur des cartes style "verre dépoli" (Frosted Glass).

### Implémentation des Cartes (GlassCard)
Contrairement aux cartes standards, nous utilisons une superposition manuelle pour un effet premium :
1.  **Ombre :** Large, violette et douce (`shadowColor: "#9D7FEA"`, `radius: 24`, `opacity: 0.15`).
2.  **Clip & Bordure :** `borderRadius: 22`.
3.  **Flou :** Composant `<BlurView intensity={40} tint="dark" />` en position absolue.
4.  **Contenu :** Padding interne de `18` à `20`.

### Boutons & Pills
*   **Forme :** Très arrondie (`borderRadius: 100`).
*   **États :**
    *   *Actif :* Fond `rgba(157,127,234,0.2)` + Bordure `rgba(157,127,234,0.25)`.
    *   *Inactif (Outlined) :* Fond transparent + Bordure fine.

## 5. Espacement & Layout
*   **Container Padding :** `20px` horizontalement.
*   **Grid Gap :** `12px` entre les éléments de liste.
*   **Border Radius Standard :** `22px` (Cartes), `16px` (Mini Cartes), `100px` (Inputs/Boutons).

## 6. Évolution Récente
*   **Suppression des "Orbs" :** Les cercles dégradés d'arrière-plan ont été retirés pour épurer l'interface (23/03/2026).
*   **Navigation :** Basée sur Expo Router (Tabs).
