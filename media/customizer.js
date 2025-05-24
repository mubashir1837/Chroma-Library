;(() => {
  const vscode = acquireVsCodeApi()
  let currentThemes = []
  let currentTheme = null
  let customColors = {}

  function init() {
    setupEventListeners()
    requestThemeData()
  }

  function setupEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".theme-card")) {
        selectTheme(e.target.closest(".theme-card"))
      }
    })

    document.addEventListener("input", (e) => {
      if (e.target.type === "color" || (e.target.type === "text" && e.target.classList.contains("color-hex"))) {
        updateColorPreview(e.target)
      }
    })

    document.getElementById("applyBtn")?.addEventListener("click", applyCurrentTheme)
    document.getElementById("resetBtn")?.addEventListener("click", resetTheme)
  }

  function requestThemeData() {
    vscode.postMessage({ type: "getThemes" })
  }

  function selectTheme(themeCard) {
    document.querySelectorAll(".theme-card").forEach((card) => {
      card.classList.remove("active")
    })

    themeCard.classList.add("active")
    const themeName = themeCard.dataset.themeName
    const theme = currentThemes.find((t) => t.displayName === themeName)

    if (theme) {
      currentTheme = theme
      vscode.postMessage({
        type: "applyTheme",
        themeName: themeName,
      })
    }
  }

  function applyCurrentTheme() {
    if (!currentTheme) {
      return
    }

    vscode.postMessage({
      type: "updateColors",
      colors: customColors,
    })
  }

  function resetTheme() {
    customColors = {}
    vscode.postMessage({
      type: "updateColors",
      colors: {},
    })
  }

  function updateColorPreview(input) {
    const colorName = input.dataset.colorName
    const color = input.value

    if (colorName && isValidHexColor(color)) {
      customColors[colorName] = color
      updateCodePreview()
    }
  }

  function updateCodePreview(theme = currentTheme) {
    if (!theme) return

    const previewCode = document.getElementById("previewCode")
    if (!previewCode) return

    // Apply syntax highlighting colors
    const colors = { ...theme.colors, ...customColors }

    previewCode.innerHTML = `<span style="color: ${colors.comment}">// Neon Futuristic Theme Preview</span>
<span style="color: ${colors.keyword}">class</span> <span style="color: ${colors.class}">NeonExample</span> <span style="color: ${colors.punctuation}">{</span>
    <span style="color: ${colors.keyword}">constructor</span><span style="color: ${colors.punctuation}">(</span><span style="color: ${colors.variable}">name</span><span style="color: ${colors.punctuation}">:</span> <span style="color: ${colors.type}">string</span><span style="color: ${colors.punctuation}>") {</span>
        <span style="color: ${colors.keyword}">this</span><span style="color: ${colors.punctuation}">.</span><span style="color: ${colors.variable}">name</span> <span style="color: ${colors.operator}">=</span> <span style="color: ${colors.variable}">name</span><span style="color: ${colors.punctuation}">;</span>
    <span style="color: ${colors.punctuation}">}</span>
    
    <span style="color: ${colors.keyword}">public</span> <span style="color: ${colors.function}">greet</span><span style="color: ${colors.punctuation}">()</span><span style="color: ${colors.punctuation}">:</span> <span style="color: ${colors.type}">void</span> <span style="color: ${colors.punctuation}">{</span>
        <span style="color: ${colors.support}">console</span><span style="color: ${colors.punctuation}">.</span><span style="color: ${colors.function}">log</span><span style="color: ${colors.punctuation}">(</span><span style="color: ${colors.string}">\`Hello, \${</span><span style="color: ${colors.keyword}">this</span><span style="color: ${colors.punctuation}">.</span><span style="color: ${colors.variable}">name</span><span style="color: ${colors.string}">}!\`</span><span style="color: ${colors.punctuation}">);</span>
    <span style="color: ${colors.punctuation}">}</span>
<span style="color: ${colors.punctuation}">}</span>

<span style="color: ${colors.keyword}">const</span> <span style="color: ${colors.variable}">example</span> <span style="color: ${colors.operator}">=</span> <span style="color: ${colors.keyword}">new</span> <span style="color: ${colors.class}">NeonExample</span><span style="color: ${colors.punctuation}">(</span><span style="color: ${colors.string}">"World"</span><span style="color: ${colors.punctuation}">);</span>
<span style="color: ${colors.variable}">example</span><span style="color: ${colors.punctuation}">.</span><span style="color: ${colors.function}">greet</span><span style="color: ${colors.punctuation}">();</span>`
  }

  function populateThemeGrid(themes) {
    const themeGrid = document.getElementById("themeGrid")
    if (!themeGrid) return

    themeGrid.innerHTML = ""

    themes.forEach((theme) => {
      const themeCard = createThemeCard(theme)
      themeGrid.appendChild(themeCard)
    })
  }

  function createThemeCard(theme) {
    const card = document.createElement("div")
    card.className = "theme-card"
    card.dataset.themeName = theme.displayName

    const title = document.createElement("h4")
    title.textContent = theme.displayName

    const preview = document.createElement("div")
    preview.className = "theme-preview"

    // Create color dots for preview
    const previewColors = [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.keyword,
      theme.colors.string,
      theme.colors.function,
    ]

    previewColors.forEach((color) => {
      const dot = document.createElement("div")
      dot.className = "color-dot"
      dot.style.backgroundColor = color
      preview.appendChild(dot)
    })

    card.appendChild(title)
    card.appendChild(preview)

    return card
  }

  function isValidHexColor(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
  }

  window.addEventListener("message", (event) => {
    const message = event.data

    switch (message.type) {
      case "themesData":
        currentThemes = message.themes
        currentTheme = message.currentTheme
        break

      case "themeApplied":
        console.log("Theme applied:", message.themeName)
        break

      case "colorsUpdated":
        console.log("Colors updated successfully")
        break

      case "error":
        console.error("Extension error:", message.message)
        break
    }
  })

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
