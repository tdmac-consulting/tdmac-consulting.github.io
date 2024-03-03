const plugin = require('tailwindcss/plugin');
// Import the parseYamlFile function
const getColors = require('./tailwind.color-importer');
// Use the function to parse the branding.yaml file
const branding = getColors('./content/globals/branding.yaml');

module.exports = {
  mode: 'jit',
  content: [
    './resources/**/*.antlers.html',
    './resources/**/*.blade.php',
    './content/**/*.md'
  ],
  important: true,
  theme: {
    screens: {
      //Extra vw for if you want a xs breakpoint (this helps with iphone 4 and galaxy fold compatibility).
      'xs': '375px',
      // => @media (min-width: 375px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1440px',
      // => @media (min-width: 1440px) { ... }
    },
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/assets/stock-imgs/bg-placeholder.jpg')",
      },
      fontFamily: {
        'genos': ['Genos', 'sans-serif'],
        'saira': ['Saira', 'sans-serif'],
      },
      strokeWidth: {
        "1/2": '0.5',
      },
      colors: {
        neutralDark: branding.data.neutral_dark,
        neutralLight: branding.data.neutral_light,
        primary: branding.data.primary,
        accent: branding.data.accent,
      }
    },
  },
  variants: {},
  plugins: [
    // Use Tailwinds container queries for responsive design: https://github.com/tailwindlabs/tailwindcss-container-queries.
    require('@tailwindcss/container-queries'),
    // Use Tailwinds aspect-ratio plugin for embedded media: https://github.com/tailwindlabs/tailwindcss-aspect-ratio.
    require('@tailwindcss/aspect-ratio'),
    // Use Tailwinds forms plugin for form styling: https://github.com/tailwindlabs/tailwindcss-forms
    require('@tailwindcss/forms')({
      strategy: 'base',
    }),

    plugin(function({ addBase, theme }) {
      addBase({
        ':root': {
          // Safari resize fix.
          minHeight: '0vw',
        },
        // Implement the focus-visible polyfill: https://github.com/WICG/focus-visible
        '.js-focus-visible :focus:not(.focus-visible)': {
          outline: 'none',
        },
      })
    }),

    plugin(function({ addComponents, theme }) {
      const components = {
        // The outer grid where all block builder blocks are a child of. Spreads out all blocks
        // vertically with a uniform space between them.
        '.outer-grid': {
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          rowGap: theme('spacing.12'),
          '& >section': {
            width: '100%',
          },
          '& >section:first-of-type, >section:only-of-type, & >article:first-of-type, >article:only-of-type': {
            paddingTop: theme('spacing.12'),
          },
          '& >section:last-of-type, >section:only-of-type, & >article:last-of-type, >article:only-of-type': {
            paddingBottom: theme('spacing.12'),
          },
        },
        '.px-standard': {
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
        },
        '@media screen(sm)': {
          //IF needed
        },
        '@media screen(md)': {
          // Larger vertical spacing between blocks on larger screens.
          '.outer-grid': {
            rowGap: theme('spacing.16'),
            '& >section:first-of-type, >section:only-of-type, & >article:first-of-type, >article:only-of-type': {
              paddingTop: theme('spacing.16'),
            },
            '& >section:last-of-type, >section:only-of-type, & >article:last-of-type, >article:only-of-type': {
              paddingBottom: theme('spacing.16'),
            },
          },
          '.px-standard': {
            paddingLeft: theme('spacing.6'),
            paddingRight: theme('spacing.6'),
          },
        },
        '@media screen(lg)': {
          // Larger vertical spacing between blocks on larger screens.
          '.outer-grid': {
            rowGap: theme('spacing.24'),
            '& >section:first-of-type, >section:only-of-type, & >article:first-of-type, >article:only-of-type': {
              paddingTop: theme('spacing.24'),
            },
            '& >section:last-of-type, >section:only-of-type, & >article:last-of-type, >article:only-of-type': {
              paddingBottom: theme('spacing.24'),
            },
          },
          '.px-standard': {
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.8'),
          },
        },
      }
      addComponents(components)
    }),

    plugin(function({ addUtilities }) {
      const newUtilities = {
        // Fill icons that have a fill defined within their paths. For example coming from an asset container.
        '.fill-current-cascade *': {
          fill: 'currentColor',
        },
        // Adds the ability to hide a scrollbar
        '.scrollbar-none': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          },
        },
      }
      addUtilities(newUtilities)
    }),
  ]
}
