/* src/utils/themeConstants.js */

export const FONTS = [
  { label: 'Inter (Modern Sans)', value: "'Inter', sans-serif" },
  { label: 'Roboto (Clean Sans)', value: "'Roboto', sans-serif" },
  { label: 'Merriweather (Classic Serif)', value: "'Merriweather', serif" },
  { label: 'Playfair Display (Elegant)', value: "'Playfair Display', serif" },
  { label: 'Fira Code (Tech Mono)', value: "'Fira Code', monospace" }
];

export const COLORS = [
  { label: 'Classic Blue', value: '#2563eb' },
  { label: 'Emerald Green', value: '#10b981' },
  { label: 'Royal Purple', value: '#8b5cf6' },
  { label: 'Crimson Red', value: '#e11d48' },
  { label: 'Charcoal Black', value: '#334155' }
];

export const THEME_PRESETS = {
  minimal: {
    fontFamily: "'Inter', sans-serif", headingFont: "'Inter', sans-serif", fontWeight: "400",
    textAlign: "left", primaryColor: "#334155", secondaryColor: "#94a3b8", bgColor: "#ffffff",
    dividerStyle: "line", layout: "single", sidebarPos: "left", contentWidth: "800", sectionStyle: "flat",
    borderRadius: "0", padding: "0", highlightHeaders: false, skillStyle: "tags", skillColor: "#f1f5f9",
    profileShape: "circle", headerAlign: "left", headerBanner: false, iconsEnabled: false, iconStyle: "minimal",
    lineSpacing: "1.6", sectionSpacing: "24", fontSize: "14"
  },
  corporate: {
    fontFamily: "'Roboto', sans-serif", headingFont: "'Roboto', sans-serif", fontWeight: "500",
    textAlign: "left", primaryColor: "#2563eb", secondaryColor: "#64748b", bgColor: "#ffffff",
    dividerStyle: "dashed", layout: "left-sidebar", sidebarPos: "left", contentWidth: "850", sectionStyle: "flat",
    borderRadius: "0", padding: "0", highlightHeaders: true, skillStyle: "progress", skillColor: "#2563eb",
    profileShape: "square", headerAlign: "centered", headerBanner: false, iconsEnabled: true, iconStyle: "outline",
    lineSpacing: "1.5", sectionSpacing: "20", fontSize: "14"
  },
  modernDark: {
    fontFamily: "'Inter', sans-serif", headingFont: "'Inter', sans-serif", fontWeight: "400",
    textAlign: "left", primaryColor: "#38bdf8", secondaryColor: "#cbd5e1", bgColor: "#0f172a",
    dividerStyle: "none", layout: "right-sidebar", sidebarPos: "right", contentWidth: "900", sectionStyle: "card",
    borderRadius: "12", padding: "16", highlightHeaders: false, skillStyle: "dots", skillColor: "#38bdf8",
    profileShape: "circle", headerAlign: "left", headerBanner: true, iconsEnabled: true, iconStyle: "filled",
    lineSpacing: "1.7", sectionSpacing: "24", fontSize: "14"
  },
  creative: {
    fontFamily: "'Merriweather', serif", headingFont: "'Playfair Display', serif", fontWeight: "400",
    textAlign: "center", primaryColor: "#e11d48", secondaryColor: "#f43f5e", bgColor: "#fff1f2",
    dividerStyle: "line", layout: "single", sidebarPos: "left", contentWidth: "800", sectionStyle: "flat",
    borderRadius: "0", padding: "0", highlightHeaders: true, skillStyle: "stars", skillColor: "#fb7185",
    profileShape: "circle", headerAlign: "centered", headerBanner: false, iconsEnabled: true, iconStyle: "outline",
    lineSpacing: "1.8", sectionSpacing: "32", fontSize: "15"
  }
};
