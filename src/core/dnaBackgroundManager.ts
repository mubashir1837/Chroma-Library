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
    const backgroundSize = `${config.size}px ${config.size}px`
    const backgroundPosition = this.getBackgroundPosition(config)

    return `
      /* DNA Background Motif */
      .monaco-workbench {
        position: relative;
      }
      
      .monaco-workbench::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-image: ${backgroundImage};
        background-size: ${backgroundSize};
        background-position: ${backgroundPosition};
        background-repeat: repeat;
        opacity: ${config.opacity};
        pointer-events: none;
        z-index: -1;
        ${config.pattern === "helix" ? this.getHelixAnimation() : ""}
      }

      /* Enhanced DNA background for editor */
      .monaco-editor .view-lines::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: ${backgroundImage};
        background-size: ${Math.floor(config.size * 0.8)}px ${Math.floor(config.size * 0.8)}px;
        background-position: ${backgroundPosition};
        background-repeat: repeat;
        opacity: ${config.opacity * 0.6};
        pointer-events: none;
        z-index: -1;
      }

      /* Sidebar DNA enhancement */
      .monaco-workbench .part.sidebar::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: ${backgroundImage};
        background-size: ${Math.floor(config.size * 0.6)}px ${Math.floor(config.size * 0.6)}px;
        background-position: ${backgroundPosition};
        background-repeat: repeat;
        opacity: ${config.opacity * 0.4};
        pointer-events: none;
        z-index: -1;
      }

      /* Terminal DNA background */
      .monaco-workbench .part.panel .terminal-wrapper::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: ${backgroundImage};
        background-size: ${Math.floor(config.size * 0.7)}px ${Math.floor(config.size * 0.7)}px;
        background-position: ${backgroundPosition};
        background-repeat: repeat;
        opacity: ${config.opacity * 0.3};
        pointer-events: none;
        z-index: -1;
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
    const encodedSVG = encodeURIComponent(svgData)
    return `url("data:image/svg+xml,${encodedSVG}")`
  }

  private createCanvasWithEmoji(config: DNABackgroundConfig): string {
    // Create a data URL for emoji background
    const size = config.size
    const spacing = config.spacing

    // Simple emoji pattern - in a real implementation, you'd use Canvas API
    const emojiPattern = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dnaPattern" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
            <text x="${spacing / 2}" y="${spacing / 2}" 
                  font-size="${size * 0.6}" 
                  text-anchor="middle" 
                  dominant-baseline="central"
                  fill="${config.color}"
                  opacity="${config.opacity}">🧬</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dnaPattern)"/>
      </svg>
    `

    return `data:image/svg+xml,${encodeURIComponent(emojiPattern)}`
  }

  private createSVGPattern(config: DNABackgroundConfig): string {
    const size = config.size
    const spacing = config.spacing

    return `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dnaHelixPattern" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
            <g fill="${config.color}" opacity="${config.opacity}">
              ${this.generateDNAHelixSVG(spacing)}
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dnaHelixPattern)"/>
      </svg>
    `
  }

  private generateDNAHelixSVG(spacing: number): string {
    const centerX = spacing / 2
    const centerY = spacing / 2
    const radius = spacing * 0.3

    return `
      <!-- DNA Double Helix Structure -->
      <path d="M${centerX - radius} ${centerY - radius * 0.8} 
               Q${centerX} ${centerY - radius * 0.4} ${centerX + radius} ${centerY}
               Q${centerX} ${centerY + radius * 0.4} ${centerX - radius} ${centerY + radius * 0.8}" 
            stroke="currentColor" stroke-width="1" fill="none"/>
      
      <path d="M${centerX + radius} ${centerY - radius * 0.8} 
               Q${centerX} ${centerY - radius * 0.4} ${centerX - radius} ${centerY}
               Q${centerX} ${centerY + radius * 0.4} ${centerX + radius} ${centerY + radius * 0.8}" 
            stroke="currentColor" stroke-width="1" fill="none"/>
      
      <!-- Base Pairs -->
      <line x1="${centerX - radius * 0.6}" y1="${centerY - radius * 0.3}" 
            x2="${centerX + radius * 0.6}" y2="${centerY - radius * 0.3}" 
            stroke="currentColor" stroke-width="0.5"/>
      
      <line x1="${centerX - radius * 0.6}" y1="${centerY + radius * 0.3}" 
            x2="${centerX + radius * 0.6}" y2="${centerY + radius * 0.3}" 
            stroke="currentColor" stroke-width="0.5"/>
      
      <!-- Nucleotide Dots -->
      <circle cx="${centerX - radius * 0.6}" cy="${centerY - radius * 0.3}" r="1" fill="currentColor"/>
      <circle cx="${centerX + radius * 0.6}" cy="${centerY - radius * 0.3}" r="1" fill="currentColor"/>
      <circle cx="${centerX - radius * 0.6}" cy="${centerY + radius * 0.3}" r="1" fill="currentColor"/>
      <circle cx="${centerX + radius * 0.6}" cy="${centerY + radius * 0.3}" r="1" fill="currentColor"/>
    `
  }

  private getBackgroundPosition(config: DNABackgroundConfig): string {
    switch (config.pattern) {
      case "grid":
        return "0 0"
      case "random":
        return this.generateRandomPositions()
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
            ${this.generateDNAHelixSVG(config.size)}
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
