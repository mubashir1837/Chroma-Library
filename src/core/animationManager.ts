import type { AnimationDefinition } from "../types/theme"
import { Logger } from "../utils/logger"

export class AnimationManager {
  private animationCache: Map<string, string> = new Map()
  private activeAnimations: Set<string> = new Set()

  public generateAnimationCSS(animation: AnimationDefinition, elementSelector: string): string {
    const cacheKey = this.createCacheKey(animation, elementSelector)

    if (this.animationCache.has(cacheKey)) {
      return this.animationCache.get(cacheKey)!
    }

    const animationName = this.generateAnimationName(animation.type, elementSelector)
    const keyframes = this.generateKeyframes(animation, animationName)
    const animationRule = this.generateAnimationRule(animation, animationName, elementSelector)

    const css = `${keyframes}\n${animationRule}`
    this.animationCache.set(cacheKey, css)

    return css
  }

  private generateKeyframes(animation: AnimationDefinition, animationName: string): string {
    switch (animation.type) {
      case "pulse":
        return this.generatePulseKeyframes(animationName)
      case "glow":
        return this.generateGlowKeyframes(animationName)
      case "fade":
        return this.generateFadeKeyframes(animationName)
      case "slide":
        return this.generateSlideKeyframes(animationName)
      case "rotate":
        return this.generateRotateKeyframes(animationName)
      default:
        Logger.warn(`Unknown animation type: ${animation.type}`)
        return ""
    }
  }

  private generatePulseKeyframes(animationName: string): string {
    return `
      @keyframes ${animationName} {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
      }
    `
  }

  private generateGlowKeyframes(animationName: string): string {
    return `
      @keyframes ${animationName} {
        0%, 100% { 
          text-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
          box-shadow: 0 0 5px currentColor;
        }
        50% { 
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
          box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
        }
      }
    `
  }

  private generateFadeKeyframes(animationName: string): string {
    return `
      @keyframes ${animationName} {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
    `
  }

  private generateSlideKeyframes(animationName: string): string {
    return `
      @keyframes ${animationName} {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(0); }
      }
    `
  }

  private generateRotateKeyframes(animationName: string): string {
    return `
      @keyframes ${animationName} {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  }

  private generateAnimationRule(
    animation: AnimationDefinition,
    animationName: string,
    elementSelector: string,
  ): string {
    const duration = `${animation.duration}ms`
    const easing = animation.easing || "ease-in-out"
    const iterations = animation.iterations || "infinite"
    const direction = animation.direction || "normal"

    return `
      ${elementSelector} {
        animation: ${animationName} ${duration} ${easing} ${iterations} ${direction};
      }
    `
  }

  private generateAnimationName(type: string, elementSelector: string): string {
    const sanitizedSelector = elementSelector.replace(/[^a-zA-Z0-9]/g, "_")
    return `neon_${type}_${sanitizedSelector}_${Date.now()}`
  }

  private createCacheKey(animation: AnimationDefinition, elementSelector: string): string {
    return `${elementSelector}_${JSON.stringify(animation)}`
  }

  public startAnimation(animationId: string): void {
    this.activeAnimations.add(animationId)
    Logger.debug(`Started animation: ${animationId}`)
  }

  public stopAnimation(animationId: string): void {
    this.activeAnimations.delete(animationId)
    Logger.debug(`Stopped animation: ${animationId}`)
  }

  public stopAllAnimations(): void {
    this.activeAnimations.clear()
    Logger.info("Stopped all animations")
  }

  public isAnimationActive(animationId: string): boolean {
    return this.activeAnimations.has(animationId)
  }

  public getActiveAnimations(): string[] {
    return Array.from(this.activeAnimations)
  }

  public clearCache(): void {
    this.animationCache.clear()
    Logger.info("Animation cache cleared")
  }

  public getCacheSize(): number {
    return this.animationCache.size
  }

  public createCustomAnimation(
    type: string,
    keyframes: Record<string, Record<string, string>>,
    options: Partial<AnimationDefinition>,
  ): AnimationDefinition {
    return {
      type: type as any,
      duration: options.duration || 1000,
      easing: options.easing || "ease-in-out",
      iterations: options.iterations || "infinite",
      direction: options.direction || "normal",
    }
  }
}
