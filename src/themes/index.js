export const themes = {
  minimal: {
    name: "Minimal / Editorial",
    vars: {
      "--bg": "#ffffff", "--surface": "#f5f5f5", "--text": "#111111",
      "--text-muted": "#666666", "--accent": "#111111", "--accent-text": "#ffffff",
      "--radius": "4px", "--font-heading": "'Inter', sans-serif",
      "--font-body": "'Inter', sans-serif", "--shadow": "0 1px 3px rgba(0,0,0,0.1)",
      "--spacing": "1.5rem"
    },
    preview: { bg: "#ffffff", accent: "#111111", text: "#111111" }
  },
  neobrutal: {
    name: "Neo-Brutal",
    vars: {
      "--bg": "#f5f0e8", "--surface": "#ffffff", "--text": "#000000",
      "--text-muted": "#333333", "--accent": "#ff4444", "--accent-text": "#000000",
      "--radius": "0px", "--font-heading": "'Space Grotesk', sans-serif",
      "--font-body": "'Space Grotesk', sans-serif", "--shadow": "4px 4px 0px #000000",
      "--spacing": "2rem"
    },
    preview: { bg: "#f5f0e8", accent: "#ff4444", text: "#000000" }
  },
  neon: {
    name: "Dark / Neon",
    vars: {
      "--bg": "#0a0a0f", "--surface": "#13131a", "--text": "#e0e0ff",
      "--text-muted": "#8888aa", "--accent": "#7c3aed", "--accent-text": "#ffffff",
      "--radius": "8px", "--font-heading": "'Syne', sans-serif",
      "--font-body": "'Inter', sans-serif", "--shadow": "0 0 20px rgba(124,58,237,0.3)",
      "--spacing": "1.5rem"
    },
    preview: { bg: "#0a0a0f", accent: "#7c3aed", text: "#e0e0ff" }
  },
  pastel: {
    name: "Pastel / Soft",
    vars: {
      "--bg": "#fef6fb", "--surface": "#fff0f7", "--text": "#3d2b3d",
      "--text-muted": "#8a6a8a", "--accent": "#e879a0", "--accent-text": "#ffffff",
      "--radius": "16px", "--font-heading": "'Playfair Display', serif",
      "--font-body": "'Lato', sans-serif", "--shadow": "0 4px 20px rgba(232,121,160,0.15)",
      "--spacing": "1.75rem"
    },
    preview: { bg: "#fef6fb", accent: "#e879a0", text: "#3d2b3d" }
  },
  luxury: {
    name: "Luxury / Serif",
    vars: {
      "--bg": "#0d0d0d", "--surface": "#1a1a1a", "--text": "#e8d5b0",
      "--text-muted": "#9a8a6a", "--accent": "#c9a84c", "--accent-text": "#0d0d0d",
      "--radius": "2px", "--font-heading": "'Cormorant Garamond', serif",
      "--font-body": "'EB Garamond', serif", "--shadow": "0 2px 10px rgba(201,168,76,0.2)",
      "--spacing": "2rem"
    },
    preview: { bg: "#0d0d0d", accent: "#c9a84c", text: "#e8d5b0" }
  },
  retro: {
    name: "Retro / Pixel",
    vars: {
      "--bg": "#1a1a2e", "--surface": "#16213e", "--text": "#00ff41",
      "--text-muted": "#00aa2a", "--accent": "#ff6b35", "--accent-text": "#000000",
      "--radius": "0px", "--font-heading": "'Press Start 2P', monospace",
      "--font-body": "'Courier New', monospace", "--shadow": "3px 3px 0px #00ff41",
      "--spacing": "1.25rem"
    },
    preview: { bg: "#1a1a2e", accent: "#ff6b35", text: "#00ff41" }
  }
};