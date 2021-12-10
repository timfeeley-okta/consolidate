module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.tsx', './components/**/*.tsx', './layouts/**/*.tsx'],

  theme: {
    fontFeatureSettings: {
      numeric: ['tnum', 'salt', 'ss02']
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-font-inter')]
}
