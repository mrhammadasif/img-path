module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  rules: {
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/indent": [
      "error",
      2
    ],

    indent: [
      "error",
      2
    ],
    "comma-dangle": "error",
    "computed-property-spacing": "error",
    "arrow-spacing": "error",
    "key-spacing": "error",
    "keyword-spacing": "error",
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 1
      }
    ],
    "switch-colon-spacing": "error",
    "no-whitespace-before-property": "error",
    "space-infix-ops": "error",
    "no-trailing-spaces": "error",
    "space-before-function-paren": "error",
    "space-in-parens": "error",
    "array-bracket-newline": [
      "error",
      {
        multiline: false,
        minItems: 1
      }
    ],
    camelcase: "warn",
    "array-bracket-spacing": "error",
    "arrow-parens": "error",
    "function-paren-newline": [
      "error",
      "multiline"
    ],
    "array-element-newline": [
      "error",
      {
        minItems: 1,
        multiline: true
      }
    ],
    "vars-on-top": "error",
    "prefer-const": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "no-lonely-if": "error",
    "no-useless-rename": "error",
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "no-var": "error",
    semi: [
      "error",
      "never"
    ],
    "one-var": [
      "error",
      "never"
    ],
    "block-scoped-var": "error",
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "object-property-newline": [
      "error",
      {
        allowAllPropertiesOnSameLine: false
      }
    ],
    "object-curly-newline": [
      "error",
      {
        ObjectExpression: "always",
        ImportDeclaration: "never"
      }
    ],
    "no-bitwise": "error",
    "require-await": "error",
    "quote-props": [
      "error",
      "as-needed"
    ],
    "sort-vars": "error",
    "wrap-iife": "error",
    "func-call-spacing": [
      "error",
      "never"
    ],
    "eol-last": "error",
    "dot-notation": "error",
    "dot-location": [
      "error",
      "property"
    ],
    curly: [
      "error",
      "all"
    ],
    "lines-between-class-members": "error",
    "comma-spacing": "error",
    quotes: [
      "error",
      "double",
      "avoid-escape"
    ]
  }
}
