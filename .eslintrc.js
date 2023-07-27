/** @type {import('eslint').ESLint} */
module.exports = {
    plugins: ['import'],
    extends: ['eslint:recommended'],
    parserOptions: { ecmaVersion: 'latest' },
    env: { node: true },
    overrides: [
        {
            env: { node: true },
            parserOptions: { sourceType: 'script' },
            files: ['.eslintrc.{js,cjs}'],
        },
    ],
    rules: {
        'indent': ['error', 4],
        'brace-style': ['error', 'stroustrup'],
        'comma-dangle': ['error', 'always-multiline'],
        'quotes': ['error', 'single'],
        'quote-props': ['error', 'consistent-as-needed'],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn'],
        'no-var': ['off'],
        'import/order': [
            'error',
            {
                'newlines-between': 'always',
                'alphabetize': { order: 'asc', caseInsensitive: true },
                'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'object', 'type'],
            },
        ],
    },
};
