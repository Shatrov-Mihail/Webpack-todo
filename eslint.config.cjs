module.exports = [
    { ignores: ['node_modules/**'] },
  
    {
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: {
          window: 'readonly',
          document: 'readonly',
          console: 'readonly',
          URL: 'readonly',
          Audio: 'readonly'
        }
      }
    },
  
    {
      rules: {
        'no-unused-vars': ['warn'],
        'no-console': 'off'
      }
    }
  ];
  