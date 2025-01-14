// Common color names mapped to hex values
export const colorMap: Record<string, string> = {
  '#FF0000': 'Red',
  '#00FF00': 'Green',
  '#0000FF': 'Blue',
  '#FFFF00': 'Yellow',
  '#FF00FF': 'Magenta',
  '#00FFFF': 'Cyan',
  '#FFA500': 'Orange',
  '#800080': 'Purple',
  '#006400': 'Dark Green',
  '#000000': 'Black',
  '#FFFFFF': 'White',
  '#808080': 'Gray',
  '#D2691E': 'Chocolate',
  '#A0522D': 'Sienna',
  '#8B4513': 'Saddle Brown',
  '#CD853F': 'Peru',
  '#800000': 'Maroon'
};

// Get a human-readable name for a hex color
export function getColorName(hex: string): string {
  return colorMap[hex.toUpperCase()] || hex;
}

// Get all available colors
export const commonColors = Object.keys(colorMap); 