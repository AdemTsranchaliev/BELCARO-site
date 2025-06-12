module.exports = {
    plugins: [
      require('autoprefixer'),
      require('@fullhuman/postcss-purgecss')({
        content: [
          './src/**/*.html',
          './src/**/*.ts',  // Include TypeScript files for Angular
          './src/**/*.js'
        ],
        safelist: {
          standard: [/^swiper-/, /^animate__/, /^wow/, /^bs-/, /^modal/, /^show/, /^fade/],
          deep: [/^swiper-/, /^animate__/, /^wow/, /^bs-/, /^modal/, /^show/, /^fade/],
          greedy: [/^swiper-/, /^animate__/, /^wow/, /^bs-/, /^modal/, /^show/, /^fade/]
        }
      }),
      require('cssnano')({
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: false,
        }]
      })
    ],
  };