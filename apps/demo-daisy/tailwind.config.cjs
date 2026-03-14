module.exports = {
  content: [
    './apps/demo-daisy/src/**/*.{html,ts,scss}',
    './packages/table-render-daisy/src/**/*.{html,ts,scss}',
    './packages/wizard-render-daisy/src/**/*.{html,ts,scss}'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light']
  }
};
