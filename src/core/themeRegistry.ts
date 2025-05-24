import { NeonTheme, ThemeCategory, ThemeSearchOptions } from "../types/theme"
import { THEME_DEFINITIONS } from "../data/themeDefinitions"
import { Logger } from "../utils/logger"

export class ThemeRegistry {
  private themes: Map<string, NeonTheme> = new Map()
  private themesByCategory: Map<ThemeCategory, NeonTheme[]> = new Map()

  constructor() {
    this.initializeThemes()
  }

  private initializeThemes(): void {
    try {
      THEME_DEFINITIONS.forEach((theme) => {
        this.themes.set(theme.name, theme)

        // Group by category
        if (!this.themesByCategory.has(theme.category)) {
          this.themesByCategory.set(theme.category, [])
        }
        this.themesByCategory.get(theme.category)!.push(theme)
      })

      Logger.info(`Initialized ${this.themes.size} themes across ${this.themesByCategory.size} categories`)
    } catch (error) {
      Logger.error("Failed to initialize themes", error)
    }
  }

  public getThemeByName(name: string): NeonTheme | undefined {
    return this.themes.get(name)
  }

  public getThemeById(id: string): NeonTheme | undefined {
    for (const theme of this.themes.values()) {
      if (theme.id === id) {
        return theme
      }
    }
    return undefined
  }

  public getAllThemes(): NeonTheme[] {
    return Array.from(this.themes.values())
  }

  public getAllThemeNames(): string[] {
    return Array.from(this.themes.keys())
  }

  public getThemesByCategory(category: ThemeCategory): NeonTheme[] {
    return this.themesByCategory.get(category) || []
  }

  public getCategories(): ThemeCategory[] {
    return Array.from(this.themesByCategory.keys())
  }

  public searchThemes(options: ThemeSearchOptions): NeonTheme[] {
    let results = this.getAllThemes()

    // Filter by category
    if (options.category) {
      results = results.filter((theme) => theme.category === options.category)
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter((theme) => options.tags!.some((tag: string) => theme.metadata.tags.includes(tag)))
    }

    // Filter by author
    if (options.author) {
      results = results.filter((theme) => theme.author.toLowerCase().includes(options.author!.toLowerCase()))
    }

    // Filter by featured status
    if (options.featured !== undefined) {
      results = results.filter((theme) => theme.metadata.featured === options.featured)
    }

    // Filter by experimental status
    if (options.experimental !== undefined) {
      results = results.filter((theme) => theme.metadata.experimental === options.experimental)
    }

    // Sort results
    if (options.sortBy) {
      results.sort((a, b) => {
        let aValue: any, bValue: any

        switch (options.sortBy) {
          case "name":
            aValue = a.displayName.toLowerCase()
            bValue = b.displayName.toLowerCase()
            break
          case "popularity":
            aValue = a.metadata.popularity
            bValue = b.metadata.popularity
            break
          case "rating":
            aValue = a.metadata.rating
            bValue = b.metadata.rating
            break
          case "created":
            aValue = new Date(a.metadata.created).getTime()
            bValue = new Date(b.metadata.created).getTime()
            break
          case "modified":
            aValue = new Date(a.metadata.modified).getTime()
            bValue = new Date(b.metadata.modified).getTime()
            break
          default:
            return 0
        }

        if (options.sortOrder === "desc") {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
        }
      })
    }

    return results
  }

  public addTheme(theme: NeonTheme): void {
    this.themes.set(theme.name, theme)

    if (!this.themesByCategory.has(theme.category)) {
      this.themesByCategory.set(theme.category, [])
    }
    this.themesByCategory.get(theme.category)!.push(theme)

    Logger.info(`Added theme: ${theme.displayName}`)
  }

  public removeTheme(name: string): boolean {
    const theme = this.themes.get(name)
    if (!theme) {
      return false
    }

    this.themes.delete(name)

    const categoryThemes = this.themesByCategory.get(theme.category)
    if (categoryThemes) {
      const index = categoryThemes.findIndex((t) => t.name === name)
      if (index !== -1) {
        categoryThemes.splice(index, 1)
      }
    }

    Logger.info(`Removed theme: ${theme.displayName}`)
    return true
  }

  public updateTheme(name: string, updates: Partial<NeonTheme>): boolean {
    const theme = this.themes.get(name)
    if (!theme) {
      return false
    }

    const updatedTheme = { ...theme, ...updates }
    this.themes.set(name, updatedTheme)

    Logger.info(`Updated theme: ${theme.displayName}`)
    return true
  }

  public getThemeCount(): number {
    return this.themes.size
  }

  public getCategoryCount(category: ThemeCategory): number {
    return this.themesByCategory.get(category)?.length || 0
  }

  public getFeaturedThemes(): NeonTheme[] {
    return this.getAllThemes().filter((theme) => theme.metadata.featured)
  }

  public getPopularThemes(limit = 10): NeonTheme[] {
    return this.getAllThemes()
      .sort((a, b) => b.metadata.popularity - a.metadata.popularity)
      .slice(0, limit)
  }

  public getRecentThemes(limit = 10): NeonTheme[] {
    return this.getAllThemes()
      .sort((a, b) => new Date(b.metadata.modified).getTime() - new Date(a.metadata.modified).getTime())
      .slice(0, limit)
  }
}
