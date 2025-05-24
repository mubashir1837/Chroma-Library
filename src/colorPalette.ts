import chroma from "chroma-js";

export interface NeonTheme {
  name: string
  displayName: string
  colors: {
    // Editor colors
    background: string
    foreground: string
    selection: string
    lineHighlight: string
    cursor: string

    // Syntax highlighting (40 colors)
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

    // Accent colors
    primary: string
    secondary: string
    tertiary: string
    success: string
    warning: string
    error: string
    info: string

    // Additional neon colors
    neonPink: string
    neonBlue: string
    neonGreen: string
    neonPurple: string
    neonOrange: string
    neonYellow: string
  }
}

export class ColorPalette {
  private static themes: Map<string, NeonTheme> = new Map()

  static {
    this.initializeThemes()
  }

  private static initializeThemes(): void {
    // Neon Cyber Theme
    this.themes.set("Neon Cyber", {
      name: "neon-cyber",
      displayName: "Neon Cyber",
      colors: {
        background: "#0a0a0f",
        foreground: "#e0e0ff",
        selection: "#ff00ff40",
        lineHighlight: "#1a1a2e",
        cursor: "#00ffff",

        keyword: "#ff0080",
        string: "#00ff80",
        number: "#80ff00",
        comment: "#666699",
        function: "#00ffff",
        variable: "#ffff00",
        type: "#ff8000",
        class: "#8000ff",
        interface: "#ff0040",
        enum: "#40ff00",
        constant: "#ff4000",
        operator: "#00ff40",
        punctuation: "#c0c0c0",
        bracket: "#ff00c0",
        tag: "#c000ff",
        attribute: "#00c0ff",
        value: "#ffc000",
        entity: "#0080ff",
        support: "#80ff80",
        storage: "#ff8080",

        sidebarBackground: "#0f0f1a",
        sidebarForeground: "#c0c0ff",
        activityBarBackground: "#050508",
        activityBarForeground: "#8080ff",
        statusBarBackground: "#1a0a1a",
        statusBarForeground: "#ff80ff",
        titleBarBackground: "#0a0a0f",
        titleBarForeground: "#e0e0ff",
        menuBackground: "#1a1a2e",
        menuForeground: "#e0e0ff",

        primary: "#ff00ff",
        secondary: "#00ffff",
        tertiary: "#ffff00",
        success: "#00ff00",
        warning: "#ffff00",
        error: "#ff0000",
        info: "#0080ff",

        neonPink: "#ff1493",
        neonBlue: "#00bfff",
        neonGreen: "#39ff14",
        neonPurple: "#bf00ff",
        neonOrange: "#ff4500",
        neonYellow: "#ffff00",
      },
    })

    // Electric Blue Theme
    this.themes.set("Electric Blue", {
      name: "electric-blue",
      displayName: "Electric Blue",
      colors: {
        background: "#0a0f1a",
        foreground: "#e0f0ff",
        selection: "#0080ff40",
        lineHighlight: "#1a2040",
        cursor: "#00bfff",

        keyword: "#0080ff",
        string: "#40c0ff",
        number: "#80e0ff",
        comment: "#4080a0",
        function: "#00a0ff",
        variable: "#c0e0ff",
        type: "#0060c0",
        class: "#0040a0",
        interface: "#4080ff",
        enum: "#80a0ff",
        constant: "#0050d0",
        operator: "#60c0ff",
        punctuation: "#a0c0e0",
        bracket: "#20a0ff",
        tag: "#0070e0",
        attribute: "#40b0ff",
        value: "#80d0ff",
        entity: "#0090ff",
        support: "#60d0ff",
        storage: "#20b0ff",

        sidebarBackground: "#0f1520",
        sidebarForeground: "#c0d0ff",
        activityBarBackground: "#050a10",
        activityBarForeground: "#8090ff",
        statusBarBackground: "#0a1520",
        statusBarForeground: "#80c0ff",
        titleBarBackground: "#0a0f1a",
        titleBarForeground: "#e0f0ff",
        menuBackground: "#1a2540",
        menuForeground: "#e0f0ff",

        primary: "#0080ff",
        secondary: "#40c0ff",
        tertiary: "#80e0ff",
        success: "#00ff80",
        warning: "#ffa000",
        error: "#ff4040",
        info: "#00bfff",

        neonPink: "#ff69b4",
        neonBlue: "#00bfff",
        neonGreen: "#00ff7f",
        neonPurple: "#9370db",
        neonOrange: "#ff6347",
        neonYellow: "#ffff00",
      },
    })

    // Plasma Pink Theme
    this.themes.set("Plasma Pink", {
      name: "plasma-pink",
      displayName: "Plasma Pink",
      colors: {
        background: "#1a0a1a",
        foreground: "#ffe0ff",
        selection: "#ff80ff40",
        lineHighlight: "#2e1a2e",
        cursor: "#ff69b4",

        keyword: "#ff1493",
        string: "#ff69b4",
        number: "#ffc0cb",
        comment: "#996699",
        function: "#ff00ff",
        variable: "#ffb6c1",
        type: "#da70d6",
        class: "#ba55d3",
        interface: "#dda0dd",
        enum: "#ee82ee",
        constant: "#ff1493",
        operator: "#ff69b4",
        punctuation: "#e6e6fa",
        bracket: "#ff00ff",
        tag: "#da70d6",
        attribute: "#dda0dd",
        value: "#ffc0cb",
        entity: "#ba55d3",
        support: "#ee82ee",
        storage: "#ff69b4",

        sidebarBackground: "#200a20",
        sidebarForeground: "#ffc0ff",
        activityBarBackground: "#100510",
        activityBarForeground: "#ff80ff",
        statusBarBackground: "#2e0a2e",
        statusBarForeground: "#ff80ff",
        titleBarBackground: "#1a0a1a",
        titleBarForeground: "#ffe0ff",
        menuBackground: "#2e1a2e",
        menuForeground: "#ffe0ff",

        primary: "#ff1493",
        secondary: "#ff69b4",
        tertiary: "#ffc0cb",
        success: "#00ff80",
        warning: "#ffa500",
        error: "#ff4040",
        info: "#ff69b4",

        neonPink: "#ff1493",
        neonBlue: "#00bfff",
        neonGreen: "#39ff14",
        neonPurple: "#bf00ff",
        neonOrange: "#ff4500",
        neonYellow: "#ffff00",
      },
    })

    // Quantum Green Theme
    this.themes.set("Quantum Green", {
      name: "quantum-green",
      displayName: "Quantum Green",
      colors: {
        background: "#0a1a0a",
        foreground: "#e0ffe0",
        selection: "#00ff0040",
        lineHighlight: "#1a2e1a",
        cursor: "#39ff14",

        keyword: "#00ff00",
        string: "#7fff00",
        number: "#adff2f",
        comment: "#669966",
        function: "#00ff7f",
        variable: "#98fb98",
        type: "#32cd32",
        class: "#228b22",
        interface: "#90ee90",
        enum: "#9acd32",
        constant: "#00ff00",
        operator: "#7fff00",
        punctuation: "#f0fff0",
        bracket: "#00ff7f",
        tag: "#32cd32",
        attribute: "#90ee90",
        value: "#adff2f",
        entity: "#228b22",
        support: "#9acd32",
        storage: "#7fff00",

        sidebarBackground: "#0f200f",
        sidebarForeground: "#c0ffc0",
        activityBarBackground: "#051005",
        activityBarForeground: "#80ff80",
        statusBarBackground: "#1a2e1a",
        statusBarForeground: "#80ff80",
        titleBarBackground: "#0a1a0a",
        titleBarForeground: "#e0ffe0",
        menuBackground: "#1a2e1a",
        menuForeground: "#e0ffe0",

        primary: "#00ff00",
        secondary: "#7fff00",
        tertiary: "#adff2f",
        success: "#00ff00",
        warning: "#ffa500",
        error: "#ff4040",
        info: "#00ff7f",

        neonPink: "#ff1493",
        neonBlue: "#00bfff",
        neonGreen: "#39ff14",
        neonPurple: "#bf00ff",
        neonOrange: "#ff4500",
        neonYellow: "#ffff00",
      },
    })
  }

  public static getThemeByName(name: string): NeonTheme | undefined {
    return this.themes.get(name)
  }

  public static getAllThemes(): NeonTheme[] {
    return Array.from(this.themes.values())
  }

  public static getAllThemeNames(): string[] {
    return Array.from(this.themes.keys())
  }

  public static generateColorVariations(baseColor: string, count = 5): string[] {
    const base = chroma(baseColor)
    const variations: string[] = []

    for (let i = 0; i < count; i++) {
      const factor = (i - Math.floor(count / 2)) * 0.2
      const variation = base.luminance(Math.max(0.01, Math.min(0.99, base.luminance() + factor)))
      variations.push(variation.hex())
    }

    return variations
  }

  public static createCustomTheme(name: string, baseColors: Partial<NeonTheme["colors"]>): NeonTheme {
    const defaultTheme = this.themes.get("Neon Cyber")!

    return {
      name: name.toLowerCase().replace(/\s+/g, "-"),
      displayName: name,
      colors: {
        ...defaultTheme.colors,
        ...baseColors,
      },
    }
  }
}
