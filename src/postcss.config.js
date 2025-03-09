module.exports = {
    plugins: [
      require('autoprefixer'),
      require('@fullhuman/postcss-purgecss')({
        content: [
          './src/**/*.html',
          './src/**/*.ts',  // Include TypeScript files for Angular
        ],
        safelist: ['safe-class'], // Optional: classes you want to retain
      }),
    ],
  };