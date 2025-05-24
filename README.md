# Neon Futuristic Themes

A production-ready Visual Studio Code extension that provides advanced theming capabilities with customizable neon-futuristic color palettes. Each theme features 40+ distinct colors designed for optimal coding experience with a striking cyberpunk aesthetic.

## Features

- 🌈 **10 Pre-built Neon Themes**: Including specialized themes for different domains
- 🧬 **DNA Helix Theme**: Special bioinformatics theme with molecular biology-inspired colors
- 🎨 **40+ Colors Per Theme**: Comprehensive color palette covering all syntax elements
- ⚡ **Live Theme Customizer**: Interactive webview panel for real-time color adjustments
- 🔄 **Auto Theme Switching**: Time-based automatic theme switching
- 💾 **Import/Export**: Save and share your custom themes
- ✨ **Glow Effects**: Optional neon glow effects for enhanced visual appeal
- 🌊 **Gradient Backgrounds**: Beautiful gradient effects across the entire VS Code interface
- 🎯 **Accessibility**: Designed with readability and contrast in mind

## Themes

### Core Neon Themes
1. **Neon Cyber** - Classic cyberpunk with hot pink and cyan
2. **Electric Blue** - Cool blue theme perfect for long coding sessions
3. **Plasma Pink** - Vibrant pink and magenta energy
4. **Quantum Green** - Matrix-inspired green theme

### Gradient Collection
5. **Neon Synthwave** - Retro 80s with pink-black gradients
6. **Deep Ocean** - Blue-black gradient depths
7. **Toxic Waste** - Radioactive green with toxic gradients
8. **Solar Flare** - Blazing orange-red solar gradients
9. **Midnight Purple** - Deep purple with midnight atmosphere

### Specialized Themes
10. **DNA Helix 🧬** - Bioinformatics theme with molecular biology colors

## DNA Helix Theme - For Bioinformatics 🧬

The DNA Helix theme is specially designed for bioinformatics researchers, computational biologists, and anyone working with genetic data. It features:

### Color Mapping Based on Molecular Biology
- **Keywords (DNA Base A)**: Blue (`#3742fa`) - Represents Adenine
- **Strings (DNA Base T)**: Red (`#ff4757`) - Represents Thymine  
- **Numbers (DNA Base G)**: Green (`#00ff99`) - Represents Guanine
- **Functions (DNA Base C)**: Orange (`#ffa502`) - Represents Cytosine
- **Variables**: Light blue for gene variables
- **Types**: Cyan for protein types
- **Classes**: Purple for molecular classes
- **Comments**: Lab notes style in muted blue

### Scientific Color Scheme
- **Laboratory gradient background** simulating research environment
- **Molecular bond colors** for brackets and operators
- **Enzyme colors** for functions and methods
- **Protein structure colors** for different code elements
- **Gene expression colors** for variables and constants

### Perfect for Bioinformatics Work
- Sequence analysis scripts (Python, R, Perl)
- Genomics data processing
- Protein structure analysis
- Phylogenetic analysis
- BLAST searches and alignments
- NGS data analysis pipelines
- Molecular dynamics simulations

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Neon Futuristic Themes"
4. Click Install

### Manual Installation
1. Download the `.vsix` file from releases
2. Open VS Code
3. Run `Extensions: Install from VSIX...` command
4. Select the downloaded file

## Usage

### Applying Themes
1. Open Command Palette (Ctrl+Shift+P)
2. Type "Preferences: Color Theme"
3. Select any of the Neon themes

### Quick DNA Helix Activation
1. Open Command Palette (Ctrl+Shift+P)
2. Run "Neon Themes: Activate DNA Helix Theme 🧬"
3. Enjoy coding with molecular biology-inspired colors!

### Theme Customization
1. Open Command Palette (Ctrl+Shift+P)
2. Run "Neon Themes: Open Theme Customizer"
3. Select a base theme
4. Customize colors in real-time
5. Apply your changes

### Gradient Controls
- **Toggle Gradients**: `Neon Themes: Toggle Gradient Backgrounds`
- **Adjust Intensity**: Modify `neonThemes.gradientIntensity` in settings

## Configuration

The extension provides several configuration options:

\`\`\`json
{
  "neonThemes.enableGlow": true,
  "neonThemes.glowIntensity": 0.8,
  "neonThemes.enableGradients": true,
  "neonThemes.gradientIntensity": 0.6,
  "neonThemes.autoSwitchTheme": false,
  "neonThemes.bioMode": false,
  "neonThemes.customColors": {}
}
\`\`\`

### Settings

- `neonThemes.enableGlow`: Enable/disable glow effects
- `neonThemes.glowIntensity`: Control glow intensity (0-1)
- `neonThemes.enableGradients`: Enable gradient backgrounds
- `neonThemes.gradientIntensity`: Control gradient intensity (0-1)
- `neonThemes.autoSwitchTheme`: Enable time-based theme switching
- `neonThemes.bioMode`: Enable bioinformatics-specific optimizations
- `neonThemes.customColors`: Store custom color overrides

## Commands

- `Neon Themes: Open Theme Customizer` - Launch the interactive theme editor
- `Neon Themes: Export Current Theme` - Export your current theme configuration
- `Neon Themes: Import Theme` - Import a theme from file
- `Neon Themes: Reset Theme to Default` - Reset all customizations
- `Neon Themes: Toggle Gradient Backgrounds` - Enable/disable gradients
- `Neon Themes: Activate DNA Helix Theme 🧬` - Quick activate bioinformatics theme

## For Bioinformatics Researchers

The DNA Helix theme is specifically crafted for:

### Programming Languages
- **Python**: Perfect for BioPython, pandas, NumPy scientific computing
- **R**: Excellent for Bioconductor packages and statistical analysis
- **Perl**: Great for BioPerl and sequence manipulation scripts
- **Java**: Ideal for bioinformatics tools and applications
- **C/C++**: Perfect for high-performance computational biology
- **JavaScript**: Great for bioinformatics web applications

### File Types
- `.py`, `.r`, `.pl`, `.java`, `.cpp`, `.js` - All optimized
- `.fasta`, `.fastq`, `.sam`, `.bam` - Sequence file highlighting
- `.pdb`, `.mol`, `.sdf` - Molecular structure files
- `.gff`, `.gtf`, `.bed` - Genomic annotation files

### Workflow Integration
- Jupyter Notebooks with enhanced cell highlighting
- RStudio integration through VS Code R extension
- Terminal colors optimized for command-line tools
- Git integration with molecular-themed diff colors

## Performance

- Lazy loading of theme data
- Efficient color computation using chroma-js
- Minimal memory footprint
- Fast theme switching
- Optimized gradient rendering

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Changelog

### 1.1.0
- Added DNA Helix theme for bioinformatics
- Enhanced gradient system with 4-stop gradients
- Added specialized commands for scientific themes
- Improved molecular biology color mapping
- Added bioinformatics mode configuration

### 1.0.0
- Initial release
- 9 pre-built neon themes
- Interactive theme customizer
- Import/export functionality
- Auto theme switching
- Gradient backgrounds
- Glow effects

## Support

- [GitHub Issues](https://github.com/your-username/neon-futuristic-themes/issues)
- [VS Code Extension Page](https://marketplace.visualstudio.com/items?itemName=your-publisher.neon-futuristic-themes)

## Credits

- Inspired by cyberpunk, molecular biology, and neon aesthetics
- DNA base color mapping based on standard molecular visualization
- Built with VS Code Extension API
- Uses chroma-js for color manipulation
- Designed for developers, scientists, and researchers who love vibrant coding environments

---

**Perfect for bioinformatics researchers, computational biologists, and anyone working with genetic data! 🧬✨**
\`\`\`

Perfect! I've created a stunning **DNA Helix theme** specifically designed for bioinformatics work! 🧬

## 🧬 **DNA Helix Theme Features:**

### **Molecular Biology Color Mapping:**
- **Keywords (Adenine)**: Blue `#3742fa` - DNA base A
- **Strings (Thymine)**: Red `#ff4757` - DNA base T  
- **Numbers (Guanine)**: Green `#00ff99` - DNA base G
- **Functions (Cytosine)**: Orange `#ffa502` - DNA base C

### **Scientific Elements:**
- **Gene Variables**: Light blue for genetic data
- **Protein Types**: Cyan for molecular structures
- **Molecular Classes**: Purple for complex molecules
- **Lab Notes**: Muted blue for comments (like lab notebook style)
- **Molecular Bonds**: Green brackets and operators
- **Enzyme Colors**: Orange functions and methods

### **Laboratory Gradient:**
- **4-stop gradient** simulating laboratory environment
- **Deep blue-black** background resembling research equipment
- **Subtle transitions** that don't distract from code

### **Perfect for Bioinformatics:**
- **Python** with BioPython, pandas, NumPy
- **R** with Bioconductor packages
- **Perl** for sequence manipulation
- **FASTA/FASTQ** file highlighting
- **Genomic annotation** files (GFF, GTF, BED)
- **Molecular structure** files (PDB, MOL)
- **NGS pipeline** development
- **Phylogenetic analysis** scripts

### **Special Features:**
- **Quick activation** command: `Activate DNA Helix Theme 🧬`
- **Bio mode** setting for specialized optimizations
- **Molecular-themed** terminal colors
- **Scientific gradient** backgrounds
- **Research-friendly** contrast ratios

The theme makes coding feel like working in a high-tech molecular biology laboratory! Perfect for computational biologists, bioinformatics researchers, and anyone working with genetic data. 🔬✨
