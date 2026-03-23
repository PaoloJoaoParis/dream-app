# GitHub Copilot Instructions — Journal de Rêves (Tamagui + Expo)

## Projet

Application mobile **Journal de Rêves** — Expo + expo-router + Tamagui + AsyncStorage.
Stack : React Native, TypeScript, Tamagui, AsyncStorage, react-native-svg, expo-blur, react-native-safe-area-context.

---

## Règle fondamentale

**Ne jamais hardcoder une couleur hex dans les composants.**
Toujours utiliser les tokens sémantiques Tamagui (`$background`, `$color`, `$accent`…)
ou `useTheme()` / `useAppTheme()` pour les valeurs dynamiques (SVG, style inline, tabBarStyle, BlurView tint).

---

## Thème dark / light — tokens sémantiques

```ts
// dark
background: '#080810'      surface: '#10101E'      surfaceHigh: '#18182E'
color: '#EEE8FF'           colorMuted: '#7A738C'   colorDim: '#3A3550'
accent: '#9D7FEA'          accentDim: 'rgba(157,127,234,0.15)'
accentWarm: '#F0A070'      borderColor: 'rgba(157,127,234,0.15)'
borderColorStrong: 'rgba(157,127,234,0.35)'
shadowColor: '#9D7FEA'     danger: '#FF6B6B'        success: '#6BFFB8'
tabBarBg: '#10101E'        tabBarBorder: '#1E1E38'
tabBarActive: '#9D7FEA'    tabBarInactive: '#7A738C'

// light
background: '#F8F5EF'      surface: '#FFFFFF'       surfaceHigh: '#EDE8DF'
color: '#1A1530'           colorMuted: '#8A7FA0'    colorDim: '#CFC9DC'
accent: '#7B5FD4'          accentDim: 'rgba(123,95,212,0.12)'
accentWarm: '#D4845A'      borderColor: 'rgba(157,127,234,0.18)'
borderColorStrong: 'rgba(157,127,234,0.4)'
shadowColor: '#7B5FD4'     danger: '#DC3535'         success: '#1A9E5C'
tabBarBg: '#FFFFFF'        tabBarBorder: '#EDE8DF'
tabBarActive: '#7B5FD4'    tabBarInactive: '#8A7FA0'
```

## Hook utilitaire — toujours utiliser ceci pour les valeurs JS

```ts
// hooks/useAppTheme.ts
import { useTheme, useThemeName } from 'tamagui'
export function useAppTheme() {
  const theme = useTheme()
  const isDark = useThemeName() === 'dark'
  return {
    theme, isDark,
    colors: {
      background: theme.background.val,   surface: theme.surface.val,
      surfaceHigh: theme.surfaceHigh.val, color: theme.color.val,
      colorMuted: theme.colorMuted.val,   accent: theme.accent.val,
      accentDim: theme.accentDim.val,     accentWarm: theme.accentWarm.val,
      borderColor: theme.borderColor.val, shadowColor: theme.shadowColor.val,
      danger: theme.danger.val,           success: theme.success.val,
      tabBarBg: theme.tabBarBg.val,       tabBarBorder: theme.tabBarBorder.val,
      tabBarActive: theme.tabBarActive.val, tabBarInactive: theme.tabBarInactive.val,
    },
  }
}
```

## Provider — détection thème système

```tsx
// app/_layout.tsx
import { TamaguiProvider } from 'tamagui'
import { useColorScheme } from 'react-native'
import { config } from '../tamagui.config'
import { Slot } from 'expo-router'

export default function RootLayout() {
  const theme = useColorScheme() ?? 'dark'
  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <Slot />
    </TamaguiProvider>
  )
}
```

---

## Safe Areas — obligatoire sur chaque écran

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Header custom
const insets = useSafeAreaInsets()
<YStack paddingTop={insets.top + 12} paddingBottom={16} paddingHorizontal={20} backgroundColor="$background">

// Tab bar
tabBarStyle: {
  backgroundColor: colors.tabBarBg,
  borderTopColor: colors.tabBarBorder,
  paddingBottom: insets.bottom + 4,
  paddingTop: 8,
  height: 56 + insets.bottom,
}

// ScrollView
contentContainerStyle={{
  paddingTop: insets.top + 8,
  paddingBottom: insets.bottom + 24,
  paddingHorizontal: 16,
}}
```

---

## Glass Liquid Cards — pattern complet

### ⚠️ Règle critique iOS : double wrapper obligatoire

Sur iOS, `overflow: hidden` supprime les ombres. Toujours séparer en deux wrappers :

```tsx
import { BlurView } from 'expo-blur'
import { StyleSheet } from 'react-native'

export function GlassCard({ children, intensity = 'medium', style }) {
  const { isDark, colors } = useAppTheme()

  const cfg = {
    light:  { blur: 20, bg: 'rgba(255,255,255,0.04)',  border: 'rgba(157,127,234,0.12)', top: 'rgba(255,255,255,0.07)' },
    medium: { blur: 40, bg: 'rgba(255,255,255,0.055)', border: 'rgba(157,127,234,0.18)', top: 'rgba(255,255,255,0.10)' },
    strong: { blur: 70, bg: 'rgba(255,255,255,0.08)',  border: 'rgba(157,127,234,0.25)', top: 'rgba(255,255,255,0.14)' },
  }[intensity]

  return (
    // Wrapper EXTERNE : ombre uniquement, pas d'overflow hidden
    <YStack
      style={[{
        borderRadius: 22,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.15 : 0.08,
        shadowRadius: 24,
        elevation: 8,      // Android
      }, style]}
    >
      {/* Wrapper INTERNE : clip pour le blur, pas d'ombre */}
      <YStack style={{ borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: cfg.border }}>
        <BlurView
          intensity={isDark ? cfg.blur : Math.round(cfg.blur * 1.4)}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        {/* Fond semi-transparent par-dessus le blur */}
        <YStack style={{ ...StyleSheet.absoluteFillObject, backgroundColor: cfg.bg }} />
        {/* Reflet interne en haut */}
        <YStack style={{ padding: 18, borderTopWidth: 1, borderTopColor: cfg.top }}>
          {children}
        </YStack>
      </YStack>
    </YStack>
  )
}
```

### Fallback Android (API < 31)

```tsx
// Détecter si BlurView est disponible
import { Platform } from 'react-native'
const canBlur = Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version >= 31)

// Dans GlassCard, remplacer BlurView si non supporté
{canBlur
  ? <BlurView intensity={cfg.blur} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
  : <YStack style={{ ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? 'rgba(16,16,30,0.88)' : 'rgba(248,245,239,0.92)' }} />
}
```

### Intensités selon contexte

```
light  → list items, badges, éléments secondaires
medium → cartes principales (DreamCard, StatCard)
strong → modals, bottom sheets, overlays
```

### Tab bar glass

```tsx
import { BlurView } from 'expo-blur'

function GlassTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets()
  const { isDark, colors } = useAppTheme()
  return (
    <BlurView
      intensity={isDark ? 50 : 80}
      tint={isDark ? 'dark' : 'light'}
      style={{
        paddingBottom: insets.bottom + 4,
        paddingTop: 8,
        paddingHorizontal: 8,
        borderTopWidth: 0.5,
        borderTopColor: colors.tabBarBorder,
        flexDirection: 'row',
      }}
    >
      {state.routes.map((route, i) => {
        const focused = state.index === i
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 12 }}
          >
            {/* Icône + label avec couleur focused/unfocused depuis colors.tabBarActive/Inactive */}
          </Pressable>
        )
      })}
    </BlurView>
  )
}
// Dans _layout.tsx :
<Tabs tabBar={props => <GlassTabBar {...props} />} />
```

---

## Composants UI — tokens sémantiques uniquement

### DreamCard

```tsx
export function DreamCard({ dream, onPress }) {
  const { theme } = useAppTheme()
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <GlassCard intensity="medium" style={{ marginBottom: 12, opacity: pressed ? 0.82 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }}>
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$xs">
            <XStack gap="$xs">
              {dream.isLucid && <Stack backgroundColor="$accentDim" borderRadius={100} paddingHorizontal={10} paddingVertical={3}><Text fontSize={11} color="$accent" fontWeight="600">✦ LUCIDE</Text></Stack>}
              <Stack backgroundColor="$surfaceHigh" borderRadius={100} paddingHorizontal={10} paddingVertical={3}><Text fontSize={11} color="$colorMuted">{dream.type}</Text></Stack>
            </XStack>
            <Text fontSize={11} color="$colorMuted">{new Date(dream.createdAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})}</Text>
          </XStack>
          <Text fontSize={15} color="$color" lineHeight={22} numberOfLines={3} marginVertical="$sm">{dream.meaning}</Text>
          {dream.tags?.length > 0 && (
            <XStack gap={6} flexWrap="wrap" marginBottom="$sm">
              {dream.tags.slice(0,4).map(t => <Stack key={t} backgroundColor="$accentDim" borderRadius={100} paddingHorizontal={10} paddingVertical={3}><Text fontSize={11} color="$accent">#{t}</Text></Stack>)}
            </XStack>
          )}
        </GlassCard>
      )}
    </Pressable>
  )
}
```

### Boutons

```tsx
// CTA principal
<Button size="$5" backgroundColor="$accent" color="$background"
  borderRadius={100} fontWeight="700" pressStyle={{ opacity: 0.85, scale: 0.97 }} animation="quick">
  Nouveau rêve
</Button>

// Secondaire
<Button size="$4" backgroundColor="$accentDim" color="$accent"
  borderRadius={100} borderWidth={0} pressStyle={{ opacity: 0.7 }} animation="quick">
  Annuler
</Button>
```

### Input recherche

```tsx
const { colors } = useAppTheme()
<XStack backgroundColor="$surface" borderRadius={16} borderWidth={1} borderColor="$borderColor"
  alignItems="center" paddingHorizontal={14} gap="$sm">
  <Search size={18} color={colors.colorMuted} />
  <Input flex={1} backgroundColor="transparent" borderWidth={0} color="$color"
    placeholderTextColor={colors.colorMuted} fontSize={15} focusStyle={{ borderWidth: 0 }} />
</XStack>
```

### FilterChip

```tsx
<Pressable onPress={onPress}>
  <Stack backgroundColor={active ? '$accent' : '$accentDim'} borderRadius={100}
    paddingHorizontal={14} paddingVertical={7} borderWidth={1}
    borderColor={active ? '$accent' : '$borderColor'}>
    <Text fontSize={13} fontWeight={active ? '600' : '400'}
      color={active ? '$background' : '$accent'}>{label}</Text>
  </Stack>
</Pressable>
```

---

## Responsive — mobile → PC

```ts
// hooks/useLayout.ts
import { useWindowDimensions } from 'react-native'
export function useLayout() {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 1024
  return {
    isPhone: width < 480, isTablet: width >= 480 && width < 1024, isDesktop,
    hPad: isDesktop ? 0 : width >= 480 ? 24 : 16,
    maxWidth: isDesktop ? 430 : '100%' as const,
    // Sur desktop : simuler un téléphone centré avec ombre
    desktopShell: isDesktop ? {
      maxWidth: 430, alignSelf: 'center' as const,
      shadowColor: '#000', shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.6, shadowRadius: 60,
      borderRadius: 40, overflow: 'hidden' as const,
    } : {},
  }
}
```

---

## Graphiques SVG maison (react-native-svg uniquement)

```tsx
// Toujours utiliser useAppTheme().colors pour les couleurs SVG — jamais de hex hardcodé
import { useAppTheme } from '../hooks/useAppTheme'
import Svg, { Circle, G } from 'react-native-svg'

export function DonutChart({ percentage, size = 120, colorKey = 'accent' }) {
  const { colors } = useAppTheme()
  const color = colors[colorKey]
  const r = (size - 10) / 2, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  return (
    <Svg width={size} height={size}>
      <G rotation="-90" origin={`${cx},${cy}`}>
        <Circle cx={cx} cy={cy} r={r} stroke={colors.accentDim} strokeWidth={8} fill="none" />
        <Circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={8} fill="none"
          strokeDasharray={circ} strokeDashoffset={circ - (percentage / 100) * circ}
          strokeLinecap="round" />
      </G>
    </Svg>
  )
}
```

---

## Limitations à toujours respecter

| ❌ Interdit | ✅ Obligatoire |
|---|---|
| Hex hardcodé dans les composants | Tokens `$accent`, `$background`… ou `useAppTheme().colors` |
| `overflow:hidden` + ombre sur le même View (iOS) | Double wrapper : ombre externe, clip interne |
| Plus de 2 BlurView imbriqués | Maximum 2 niveaux de blur simultanés |
| `BlurView` sans fallback Android | Détecter `Platform.Version >= 31` |
| Padding horizontal < 16px | Toujours ≥ 16px, idéalement 20px |
| Contenu sous le notch/Dynamic Island | `useSafeAreaInsets().top` sur chaque header |
| Tab bar collée au bord bas | `paddingBottom: insets.bottom + 4` |
| Balise `<form>` | `Pressable` + `onPress` uniquement |
| Lib graphique externe (gifted-charts…) | SVG maison avec react-native-svg |
| Boutons carrés | `borderRadius={100}` (pill) |

## Modèle Dream

```ts
interface Dream {
  id: string; createdAt: string; type: string; isLucid: boolean
  emotionBefore: string; emotionAfter: string; intensity: number
  location: string; tags: string[]; characters: string[]
  clarity: string; sleepQuality: string; meaning: string
}
```

## Structure fichiers

```
app/(tabs)/_layout.tsx  — navigation + GlassTabBar
app/(tabs)/index.tsx    — liste rêves
app/(tabs)/search.tsx   — recherche + filtres
app/(tabs)/stats.tsx    — statistiques SVG
components/GlassCard.tsx
components/DreamCard.tsx
components/ScreenWrapper.tsx
components/SearchInput.tsx
hooks/useAppTheme.ts
hooks/useLayout.ts
dreamStorage.js
tamagui.config.ts
```
