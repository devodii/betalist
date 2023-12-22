/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: 'crlf',
  semi: false,
  useTabs: false,
  singleQuote: true,
  arrowParens: 'avoid',
  tabWidth: 2,
  trailingComma: 'none',
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^types$',
    '^@app/types$',
    '^@/config/(.*)$',
    '^@lib/(.*)$',
    '^@hooks/(.*)$',
    '^@components/ui/(.*)$',
    '^@components/(.*)$',
    '^@/registry/(.*)$',
    '^@/styles/(.*)$',
    '^@app/(.*)$',
    '',
    '^[./]'
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  plugins: ['prettier-plugin-tailwindcss']
}
