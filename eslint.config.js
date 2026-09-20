import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            // reactRefresh removed completely!
        ],
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            // 1. Turn off unused variable & import errors completely
            '@typescript-eslint/no-unused-vars': 'off',
            'no-unused-vars': 'off',

            // 2. Allow any "any" types without complaints
            '@typescript-eslint/no-explicit-any': 'off',

            // 3. Allow empty interfaces, functions, and non-null assertions
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',

            // 4. Don't enforce React import in JSX
            'react/react-in-jsx-scope': 'off',
        },
    },
]);
