module.exports = [
    { ignores: ['node_modules/**', 'dist/**'] },
  
    {
      files: ['**/*.ts'],
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: 'module',
          project: './tsconfig.json'
        },
        globals: {
          window: 'readonly',
          document: 'readonly',
          console: 'readonly',
          URL: 'readonly',
          Audio: 'readonly'
        }
      },
      plugins: {
        '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn'],
        'no-console': 'off'
      }
    },
  
    {
      files: ['**/*.js'],
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
      },
      rules: {
        'no-unused-vars': ['warn'],
        'no-console': 'off'
      }
    }
  ];
  