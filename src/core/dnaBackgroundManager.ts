export interface DNABackgroundConfig {
  enabled: boolean
  pattern: "grid" | "random" | "helix"
  opacity: number
  size: number
  spacing: number
  color: string
  useEmoji: boolean
}

export class DNABackgroundManager {
  private static readonly DNA_EMOJI = "🧬"
  private static readonly DNA_SVG = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6C3 6 6 3 12 3C18 3 21 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M3 18C3 18 6 21 12 21C18 21 21 18 21 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M6 9L18 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M6 15L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="6" cy="9" r="1.5" fill="currentColor"/>
      <circle cx="18" cy="9" r="1.5" fill="currentColor"/>
      <circle cx="6" cy="15" r="1.5" fill="currentColor"/>
      <circle cx="18" cy="15" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="6" r="1" fill="currentColor"/>
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
    </svg>
  `

  public generateDNABackgroundCSS(config: DNABackgroundConfig): string {
    if (!config.enabled) {
      return ""
    }

    const backgroundImage = this.createBackgroundImage(config)
    const isRandom = config.pattern === "random"
    const bgSize = isRandom ? "800px 800px" : `${config.size}px ${config.size}px`
    const editorSize = isRandom ? "800px 800px" : `${Math.floor(config.size * 0.8)}px ${Math.floor(config.size * 0.8)}px`
    const sidebarSize = isRandom ? "800px 800px" : `${Math.floor(config.size * 0.6)}px ${Math.floor(config.size * 0.6)}px`
    const terminalSize = isRandom ? "800px 800px" : `${Math.floor(config.size * 0.7)}px ${Math.floor(config.size * 0.7)}px`
    const backgroundPosition = this.getBackgroundPosition(config)

    return `
      /* DNA Background Motif */
      .monaco-workbench {
        position: relative;
      }
      
      .monaco-workbench::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-image: ${backgroundImage} !important;
        background-size: ${bgSize} !important;
        background-position: ${backgroundPosition} !important;
        background-repeat: repeat !important;
        opacity: ${config.opacity} !important;
        pointer-events: none !important;
        z-index: 0 !important; /* Over workbench background, under parts */
        ${config.pattern === "helix" ? this.getHelixAnimation() : ""}
      }

      /* Enhanced DNA background for editor content */
      .monaco-editor .view-lines::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: ${backgroundImage} !important;
        background-size: ${editorSize} !important;
        background-position: ${backgroundPosition} !important;
        background-repeat: repeat !important;
        opacity: ${config.opacity * 0.8} !important;
        pointer-events: none !important;
        z-index: 1 !important; /* Above text background but behind text */
      }
      
      .monaco-editor .view-lines {
        z-index: 1;
      }
      
      /* Let the background show through */
      .monaco-editor, 
      .monaco-editor .margin, 
      .monaco-editor-background, 
      .monaco-editor .inputarea.ime-input {
        background-color: transparent !important;
      }
      
      .monaco-workbench {
        background-color: ${config.color.includes("#") ? config.color.slice(0, 7) + "05" : "transparent"} !important; /* Tinted workbench */
      }

      /* Sidebar DNA enhancement */
      .monaco-workbench .part.sidebar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: ${backgroundImage} !important;
        background-size: ${sidebarSize} !important;
        background-position: ${backgroundPosition} !important;
        background-repeat: repeat !important;
        opacity: ${config.opacity * 0.4} !important;
        pointer-events: none !important;
        z-index: 0 !important;
      }

      /* Terminal DNA background */
      .monaco-workbench .part.panel .terminal-wrapper::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: ${backgroundImage} !important;
        background-size: ${terminalSize} !important;
        background-position: ${backgroundPosition} !important;
        background-repeat: repeat !important;
        opacity: ${config.opacity * 0.3} !important;
        pointer-events: none !important;
        z-index: 0 !important;
      }
    `
  }

  private createBackgroundImage(config: DNABackgroundConfig): string {
    if (config.useEmoji) {
      return this.createEmojiBackground(config)
    } else {
      return this.createSVGBackground(config)
    }
  }

  private createEmojiBackground(config: DNABackgroundConfig): string {
    const canvas = this.createCanvasWithEmoji(config)
    return `url("${canvas}")`
  }

  private createSVGBackground(config: DNABackgroundConfig): string {
    const svgData = this.createSVGPattern(config)
    return `url("data:image/svg+xml;base64,${Buffer.from(svgData).toString("base64")}")`
  }

  private createCanvasWithEmoji(config: DNABackgroundConfig): string {
    const size = config.size;
    const spacing = config.spacing;

    if (config.pattern === "random") {
      const count = 60; // Increased density for scattered layout
      const elements = [];
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 800);
        const y = Math.floor(Math.random() * 800);
        const rot = Math.floor(Math.random() * 360);
        const scale = 0.5 + Math.random();
        
        const svgScale = scale * (size / 24);
        elements.push(`
          <g transform="translate(${x}, ${y}) rotate(${rot}) scale(${svgScale}) translate(-12, -12)" 
             fill="none" 
             stroke="${config.color}" 
             stroke-width="2" 
             stroke-linecap="round" 
             stroke-linejoin="round" 
             opacity="1">
            <path d="m10 16 1.5 1.5" />
            <path d="m14 8-1.5-1.5" />
            <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
            <path d="m16.5 10.5 1 1" />
            <path d="m17 6-2.891-2.891" />
            <path d="M2 15c6.667-6 13.333 0 20-6" />
            <path d="m20 9 .891.891" />
            <path d="M3.109 14.109 4 15" />
            <path d="m6.5 12.5 1 1" />
            <path d="m7 18 2.891 2.891" />
            <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
          </g>
        `);
      }
      
      const emojiPattern = `
        <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          ${elements.join("")}
        </svg>
      `;
      return `data:image/svg+xml;base64,${Buffer.from(emojiPattern).toString("base64")}`;
    }

    // Simple emoji pattern - in a real implementation, you'd use Canvas API
    const emojiPattern = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dnaPattern" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
            <g transform="translate(${spacing / 2}, ${spacing / 2}) scale(${size * 0.4 / 24}) translate(-12, -12)" 
               fill="none" 
               stroke="${config.color}" 
               stroke-width="2" 
               stroke-linecap="round" 
               stroke-linejoin="round" 
               opacity="${config.opacity}">
              <path d="m10 16 1.5 1.5" />
              <path d="m14 8-1.5-1.5" />
              <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
              <path d="m16.5 10.5 1 1" />
              <path d="m17 6-2.891-2.891" />
              <path d="M2 15c6.667-6 13.333 0 20-6" />
              <path d="m20 9 .891.891" />
              <path d="M3.109 14.109 4 15" />
              <path d="m6.5 12.5 1 1" />
              <path d="m7 18 2.891 2.891" />
              <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dnaPattern)"/>
      </svg>
    `

    return `data:image/svg+xml;base64,${Buffer.from(emojiPattern).toString("base64")}`
  }

  private createSVGPattern(config: DNABackgroundConfig): string {
    if (config.pattern === "random") {
      return this.createRandomHelixPattern(config);
    }

    return `
      <svg width="${config.size}" height="${config.size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dnaHelixPattern" x="0" y="0" width="${config.spacing}" height="${config.spacing}" patternUnits="userSpaceOnUse">
            <g opacity="${config.opacity}">
              ${this.generateDNAHelixSVG(config.spacing, config.color)}
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dnaHelixPattern)"/>
      </svg>
    `
  }

  private generateDNAHelixSVG(spacing: number, color: string): string {
    const centerX = spacing / 2
    const centerY = spacing / 2
    const radius = spacing * 0.3

    return `
      <!-- DNA Double Helix Structure -->
      <path d="M${centerX - radius} ${centerY - radius * 0.8} 
               Q${centerX} ${centerY - radius * 0.4} ${centerX + radius} ${centerY}
               Q${centerX} ${centerY + radius * 0.4} ${centerX - radius} ${centerY + radius * 0.8}" 
            stroke="${color}" stroke-width="1" fill="none"/>
      
      <path d="M${centerX + radius} ${centerY - radius * 0.8} 
               Q${centerX} ${centerY - radius * 0.4} ${centerX - radius} ${centerY}
               Q${centerX} ${centerY + radius * 0.4} ${centerX + radius} ${centerY + radius * 0.8}" 
            stroke="${color}" stroke-width="1" fill="none"/>
      
      <!-- Base Pairs -->
      <line x1="${centerX - radius * 0.6}" y1="${centerY - radius * 0.3}" 
            x2="${centerX + radius * 0.6}" y2="${centerY - radius * 0.3}" 
            stroke="${color}" stroke-width="0.5"/>
      
      <line x1="${centerX - radius * 0.6}" y1="${centerY + radius * 0.3}" 
            x2="${centerX + radius * 0.6}" y2="${centerY + radius * 0.3}" 
            stroke="${color}" stroke-width="0.5"/>
      
      <!-- Nucleotide Dots -->
      <circle cx="${centerX - radius * 0.6}" cy="${centerY - radius * 0.3}" r="1" fill="${color}"/>
      <circle cx="${centerX + radius * 0.6}" cy="${centerY - radius * 0.3}" r="1" fill="${color}"/>
      <circle cx="${centerX - radius * 0.6}" cy="${centerY + radius * 0.3}" r="1" fill="${color}"/>
      <circle cx="${centerX + radius * 0.6}" cy="${centerY + radius * 0.3}" r="1" fill="${color}"/>
    `
  }

  private getBackgroundPosition(config: DNABackgroundConfig): string {
    switch (config.pattern) {
      case "grid":
        return "0 0"
      case "random":
        return "0 0"
      case "helix":
        return "0 0"
      default:
        return "0 0"
    }
  }

  private generateRandomPositions(): string {
    // Generate multiple random positions for a scattered effect
    const positions = []
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      positions.push(`${x}% ${y}%`)
    }
    return positions.join(", ")
  }

  private getHelixAnimation(): string {
    return `
      animation: dnaRotate 20s linear infinite;
      
      @keyframes dnaRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  }

  public getDefaultConfig(): DNABackgroundConfig {
    return {
      enabled: true,
      pattern: "grid",
      opacity: 0.08,
      size: 48,
      spacing: 80,
      color: "#00ffcc",
      useEmoji: true,
    }
  }

  public createRandomHelixPattern(config: DNABackgroundConfig): string {
    const positions = []
    const count = 15 // Number of DNA helixes

    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      const rotation = Math.random() * 360
      const scale = 0.8 + Math.random() * 0.4 // Scale between 0.8 and 1.2

      positions.push({
        x: `${x}%`,
        y: `${y}%`,
        rotation,
        scale,
      })
    }

    return `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <g id="dnaHelix">
            ${this.generateDNAHelixSVG(config.size, config.color)}
          </g>
        </defs>
        ${positions
          .map(
            (pos) => `
          <use href="#dnaHelix" 
               x="${pos.x}" y="${pos.y}" 
               transform="rotate(${pos.rotation}) scale(${pos.scale})"
               opacity="${config.opacity}"/>
        `,
          )
          .join("")}
      </svg>
    `
  }
}
