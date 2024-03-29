/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    trailingComma: 'es5',
    semi: true,
    tabWidth: 4,
    singleQuote: true,
    jsxSingleQuote: true,
    plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
