import type { GradientDefinition, GradientStop } from "../types/theme"
import { Logger } from "../utils/logger"

export class GradientManager {
  private gradientCache: Map<string, string> = new Map()

  public generateGradientCSS(gradient: GradientDefinition): string {
    const cacheKey = this.createCacheKey(gradient)

    if (this.gradientCache.has(cacheKey)) {
      return this.gradientCache.get(cacheKey)!
    }

    let css = ""

    switch (gradient.type) {
      case "linear":
        css = this.generateLinearGradient(gradient)
        break
      case "radial":
        css = this.generateRadialGradient(gradient)
        break
      case "conic":
        css = this.generateConicGradient(gradient)
        break
      default:
        Logger.warn(`Unknown gradient type: ${gradient.type}`)
        return ""
    }

    this.gradientCache.set(cacheKey, css)
    return css
  }

  private generateLinearGradient(gradient: GradientDefinition): string {
    const direction = gradient.direction || "to bottom"
    const stops = this.formatGradientStops(gradient.stops)
    return `linear-gradient(${direction}, ${stops})`
  }

  private generateRadialGradient(gradient: GradientDefinition): string {
    const shape = gradient.direction || "circle"
    const stops = this.formatGradientStops(gradient.stops)
    return `radial-gradient(${shape}, ${stops})`
  }

  private generateConicGradient(gradient: GradientDefinition): string {
    const angle = gradient.direction || "from 0deg"
    const stops = this.formatGradientStops(gradient.stops)
    return `conic-gradient(${angle}, ${stops})`
  }

  private formatGradientStops(stops: GradientStop[]): string {
    return stops.map((stop) => `${stop.color} ${stop.position * 100}%`).join(", ")
  }

  private createCacheKey(gradient: GradientDefinition): string {
    return JSON.stringify(gradient)
  }

  public clearCache(): void {
    this.gradientCache.clear()
    Logger.info("Gradient cache cleared")
  }

  public getCacheSize(): number {
    return this.gradientCache.size
  }

  public createGradientFromColors(
    colors: string[],
    type: "linear" | "radial" | "conic" = "linear",
  ): GradientDefinition {
    const stops: GradientStop[] = colors.map((color, index) => ({
      color,
      position: index / (colors.length - 1),
    }))

    return {
      type,
      stops,
      direction: type === "linear" ? "to bottom" : undefined,
    }
  }

  public interpolateGradient(
    gradient1: GradientDefinition,
    gradient2: GradientDefinition,
    factor: number,
  ): GradientDefinition {
    if (gradient1.type !== gradient2.type) {
      throw new Error("Cannot interpolate gradients of different types")
    }

    const interpolatedStops: GradientStop[] = []
    const maxStops = Math.max(gradient1.stops.length, gradient2.stops.length)

    for (let i = 0; i < maxStops; i++) {
      const stop1 = gradient1.stops[i] || gradient1.stops[gradient1.stops.length - 1]
      const stop2 = gradient2.stops[i] || gradient2.stops[gradient2.stops.length - 1]

      interpolatedStops.push({
        color: this.interpolateColor(stop1.color, stop2.color, factor),
        position: stop1.position + (stop2.position - stop1.position) * factor,
      })
    }

    return {
      type: gradient1.type,
      direction: gradient1.direction,
      stops: interpolatedStops,
    }
  }

  private interpolateColor(color1: string, color2: string, factor: number): string {
    // Simple color interpolation - in a real implementation, you'd use a color library
    // This is a placeholder implementation
    return factor < 0.5 ? color1 : color2
  }
}
