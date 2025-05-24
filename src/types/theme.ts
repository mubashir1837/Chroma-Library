export type ThemeCategory = "dark" | "light" | "neon" | "cyberpunk" | "matrix" | "synthwave" | "vaporwave"

export interface NeonTheme {
  id: string
  name: string
  displayName: string
  category: ThemeCategory
  description: string
  author: string
  version: string
  colors: ThemeColors
  gradients?: ThemeGradients
  animations?: ThemeAnimations
  metadata: ThemeMetadata
}

export interface ThemeColors {
  // Editor colors
  background: string
  foreground: string
  selection: string
  lineHighlight: string
  cursor: string

  // Syntax highlighting (45+ colors)
  keyword: string
  string: string
  number: string
  comment: string
  function: string
  variable: string
  type: string
  class: string
  interface: string
  enum: string
  constant: string
  operator: string
  punctuation: string
  bracket: string
  tag: string
  attribute: string
  value: string
  entity: string
  support: string
  storage: string

  // Additional syntax colors
  regexp: string
  escape: string
  embedded: string
  invalid: string
  deprecated: string
  builtin: string
  library: string
  namespace: string
  module: string
  decorator: string
  annotation: string
  macro: string
  preprocessor: string
  label: string
  parameter: string

  // UI colors
  sidebarBackground: string
  sidebarForeground: string
  activityBarBackground: string
  activityBarForeground: string
  statusBarBackground: string
  statusBarForeground: string
  titleBarBackground: string
  titleBarForeground: string
  menuBackground: string
  menuForeground: string

  // Panel colors
  panelBackground: string
  panelForeground: string
  panelBorder: string
  terminalBackground: string
  terminalForeground: string

  // Tab colors
  tabActiveBackground: string
  tabActiveForeground: string
  tabInactiveBackground: string
  tabInactiveForeground: string

  // Button and input colors
  buttonBackground: string
  buttonForeground: string
  inputBackground: string
  inputForeground: string
  inputBorder: string

  // Accent colors
  primary: string
  secondary: string
  tertiary: string
  success: string
  warning: string
  error: string
  info: string

  // Neon accent colors
  neonPink: string
  neonBlue: string
  neonGreen: string
  neonPurple: string
  neonOrange: string
  neonYellow: string
  neonCyan: string
  neonRed: string
}

export interface ThemeGradients {
  background?: GradientDefinition
  sidebar?: GradientDefinition
  statusBar?: GradientDefinition
  titleBar?: GradientDefinition
  panel?: GradientDefinition
}

export interface GradientDefinition {
  type: "linear" | "radial" | "conic"
  direction?: string
  stops: GradientStop[]
  opacity?: number
}

export interface GradientStop {
  color: string
  position: number
}

export interface ThemeAnimations {
  cursor?: AnimationDefinition
  selection?: AnimationDefinition
  glow?: AnimationDefinition
  pulse?: AnimationDefinition
}

export interface AnimationDefinition {
  type: "pulse" | "glow" | "fade" | "slide" | "rotate"
  duration: number
  easing: string
  iterations?: number | "infinite"
  direction?: "normal" | "reverse" | "alternate"
}

export interface ThemeMetadata {
  created: string
  modified: string
  tags: string[]
  popularity: number
  rating: number
  downloads: number
  featured: boolean
  experimental: boolean
}

export interface ThemeExportData {
  theme: NeonTheme
  customizations: Record<string, any>
  settings: Record<string, any>
  version: string
  exportDate: string
}

export interface ThemeImportOptions {
  overwriteExisting: boolean
  mergeCustomizations: boolean
  applyImmediately: boolean
}

export interface ThemeValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export interface ThemeSearchOptions {
  category?: ThemeCategory
  tags?: string[]
  author?: string
  featured?: boolean
  experimental?: boolean
  sortBy?: "name" | "popularity" | "rating" | "created" | "modified"
  sortOrder?: "asc" | "desc"
}
export interface ThemeCustomization {
  customColors?: Record<string, string>
  enableGlow?: boolean
  glowIntensity?: number
  dnaBackground?: DNABackgroundConfig
}

export interface DNABackgroundConfig {
  enabled: boolean
  color?: string
  intensity?: number
  speed?: number
  [key: string]: any
}