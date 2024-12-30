module.exports =  {
    parser:  '@typescript-eslint/parser',  
    plugins: ['@typescript-eslint'],
    extends:  [
      'plugin:@typescript-eslint/recommended', 
      'eslint:recommended',
    ],
    parserOptions:  {
      ecmaVersion:  2020,  
      sourceType:  'module',  
      project: './tsconfig.json',
    },
    rules:  {
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-explicit-any': 'off', 
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'prettier/prettier': 'error',
    },
  };
  