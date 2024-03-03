// Import the required modules
const fs = require('fs');
const yaml = require('js-yaml');
const colorProcessor = require('color');

// Reduce percentage function
function reducePercentage(percentage) {
  // Check if the input percentage is exactly 100%
  if (percentage === 100) {
      // If it is, return 10%
      return 10;
  }

  // Extract the decimal part of the percentage
  var decimalPart = percentage % 10;

  // If the decimal part is less than 10, return the decimal part
  // Otherwise, return the original percentage
  return decimalPart < 10 ? decimalPart : percentage;
}

// Define a function to generate color shades
function generateColorShades(hexColor, defaultLightness) {
  const color = colorProcessor(hexColor);
  const shades = {};
  const lightness = reducePercentage(color.hsl().color[2] * 10);

  // Generate shades
  for (let i = 1; i <= 9; i++) {
    // Generate the shade and add it to the shades object
    const shade = colorProcessor.hsl(color.hsl().color[0], color.hsl().color[1], (( ( 9 - i ) * 10 ) + lightness)).string();
    shades[i * 100] = shade;
  }

  shades[50] = colorProcessor.hsl(color.hsl().color[0], color.hsl().color[1], ( ( ( 100 - ( 80 + lightness ) ) / 2 ) + ( 80 + lightness ) )).string();
  shades.DEFAULT = color.hsl().string();

  return shades;
}

// Define a function to read and parse the YAML file
function parseAndGenerateColors(filePath) {
  let parsedContent;

  try {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse the YAML content
    parsedContent = yaml.load(fileContent);

    // Generate color shades for each color
    for (const color in parsedContent.data) {
      try {
        // Try to create a color object
        const colorObj = colorProcessor(parsedContent.data[color]);

        // If the color object is created successfully, generate shades and replace the color value with the shades
        parsedContent.data[color] = generateColorShades(parsedContent.data[color]);
      } catch (error) {
        // If an error occurs, it means the input is not a valid color, so do nothing
      }
    }
  } catch (error) {
    console.error(`Failed to parse YAML file at ${filePath}: ${error.message}`);
    parsedContent = {};
  }

  // Return the parsed content
  return parsedContent;
}

// Export the function
module.exports = parseAndGenerateColors;
