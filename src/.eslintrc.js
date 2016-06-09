module.exports = {
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "impliedStrict": true
    }
  },
  "parser": "babel-eslint",
  "plugins": [
    "angular"
  ],
  "env": {
    "browser": true,
    "jquery": true,
    "es6": true
  },
  "globals": {
    "angular": false
  },
  "rules": {
    "no-alert": "error",
    "no-array-constructor": "error",
    "no-bitwise": "error",
    "no-caller": "error",
    "no-case-declarations": "error",
    "no-catch-shadow": "error",
    "no-class-assign": "error",
    "no-cond-assign": "error",
    "no-confusing-arrow": "error",
    "no-console": "error",
    "no-const-assign": "error",
    "no-constant-condition": "error",
    "no-continue": "error",
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-delete-var": "error",
    "no-div-regex": "error",
    "no-dupe-class-members": "error",
    "no-dupe-keys": "error",
    "no-dupe-args": "error",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "error",
    "no-else-return": "off",
    "no-empty": "error",
    "no-empty-character-class": "error",
    "no-empty-function": "error",
    "no-empty-pattern": "error",
    "no-eq-null": "error",
    "no-eval": "error",
    "no-ex-assign": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-boolean-cast": "error",
    "no-extra-label": "error",
    "no-extra-parens": ["error", "all", {
      "returnAssign": false
    }],
    "no-extra-semi": "error",
    "no-fallthrough": "error",
    "no-floating-decimal": "error",
    "no-func-assign": "error",
    "no-implicit-coercion": "off",
    "no-implicit-globals": "error",
    "no-implied-eval": "error",
    "no-inline-comments": "off",
    "no-inner-declarations": "error",
    "no-invalid-regexp": "error",
    "no-invalid-this": "error",
    "no-irregular-whitespace": "error",
    "no-iterator": "error",
    "no-label-var": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-lonely-if": "error",
    "no-loop-func": "error",
    "no-mixed-requires": "error",
    "no-mixed-spaces-and-tabs": "error",
    "linebreak-style": ["error", "windows"],
    "no-multi-spaces": "error",
    "no-multi-str": "error",
    "no-multiple-empty-lines": "error",
    "no-native-reassign": "error",
    "no-negated-condition": "error",
    "no-negated-in-lhs": "error",
    "no-nested-ternary": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-object": "error",
    "no-new-require": "error",
    "no-new-symbol": "error",
    "no-new-wrappers": "error",
    "no-obj-calls": "error",
    "no-octal": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "error",
    "no-path-concat": "error",
    "no-plusplus": "off",
    "no-process-env": "error",
    "no-process-exit": "error",
    "no-proto": "error",
    "no-prototype-builtins": "off",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-restricted-globals": "error",
    "no-restricted-imports": "error",
    "no-restricted-modules": "error",
    "no-restricted-syntax": "error",
    "no-return-assign": ["error", "except-parens"],
    "no-script-url": "error",
    "no-self-assign": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow": "off",
    "no-shadow-restricted-names": "error",
    "no-whitespace-before-property": "error",
    "no-spaced-func": "error",
    "no-sparse-arrays": "error",
    "no-sync": "error",
    "no-ternary": "error",
    "no-trailing-spaces": "error",
    "no-this-before-super": "error",
    "no-throw-literal": "error",
    "no-undef": "error",
    "no-undef-init": "error",
    "no-undefined": "error",
    "no-unexpected-multiline": "error",
    "no-underscore-dangle": "error",
    "no-unmodified-loop-condition": "error",
    "no-unneeded-ternary": "error",
    "no-unreachable": "error",
    "no-unsafe-finally": "error",
    "no-unused-expressions": "error",
    "no-unused-labels": "error",
    "no-unused-vars": "error",
    "no-use-before-define": ["error", {
      "functions": false,
      "classes": true
    }],
    "no-useless-call": "error",
    "no-useless-computed-key": "error",
    "no-useless-concat": "error",
    "no-useless-constructor": "error",
    "no-useless-escape": "error",
    "no-useless-rename": "error",
    "no-void": "error",
    "no-var": "error",
    "no-warning-comments": "warn",
    "no-with": "error",
    "no-magic-numbers": "off",
    "array-bracket-spacing": "error",
    "array-callback-return": "error",
    "arrow-body-style": "error",
    "arrow-parens": ["error", "as-needed"],
    "arrow-spacing": "error",
    "accessor-pairs": "error",
    "block-scoped-var": "error",
    "block-spacing": "error",
    "brace-style": "error",
    "callback-return": "error",
    "camelcase": ["error", {
      "properties": "never"
    }],
    "comma-dangle": "error",
    "comma-spacing": "error",
    "comma-style": "error",
    "complexity": ["error", 11],
    "computed-property-spacing": "error",
    "consistent-return": "error",
    "consistent-this": "off",
    "constructor-super": "error",
    "curly": "error",
    "default-case": "error",
    "dot-location": ["error", "property"],
    "dot-notation": "error",
    "eol-last": "error",
    "eqeqeq": "error",
    "func-names": "error",
    "func-style": ["error", "declaration", {
      "allowArrowFunctions": true
    }],
    "generator-star-spacing": "error",
    "global-require": "error",
    "guard-for-in": "error",
    "handle-callback-err": "error",
    "id-length": ["error", {
      "properties": "never",
      "exceptions": ["i", "j"]
    }],
    "indent": ["error", 2],
    "init-declarations": "error",
    "jsx-quotes": "error",
    "key-spacing": "error",
    "keyword-spacing": "error",
    "lines-around-comment": "error",
    "max-depth": "error",
    "max-len": "off",
    "max-nested-callbacks": "error",
    "max-params": "off", // TODO
    "max-statements": "off", // TODO
    "max-statements-per-line": "error",
    "new-cap": "error",
    "new-parens": "error",
    "newline-after-var": "off",
    "newline-before-return": "off",
    "newline-per-chained-call": "error",
    "object-curly-spacing": ["error", "always"],
    "object-property-newline": ["error", {
      "allowMultiplePropertiesPerLine": true
    }],
    "object-shorthand": "error",
    "one-var": ["error", "never"],
    "one-var-declaration-per-line": "error",
    "operator-assignment": "error",
    "operator-linebreak": "error",
    "padded-blocks": ["error", "never"],
    "prefer-arrow-callback": ["error", {
      "allowNamedFunctions": true
    }],
    "prefer-const": "error",
    "prefer-reflect": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "quote-props": ["error", "as-needed"],
    "quotes": ["error", "single", {
      "avoidEscape": true,
      "allowTemplateLiterals": true
    }],
    "radix": "error",
    "id-match": "error",
    "id-blacklist": "error",
    "require-jsdoc": "off", // TODO
    "require-yield": "error",
    "semi": "error",
    "semi-spacing": "error",
    "sort-vars": "error",
    "sort-imports": "error",
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never"
    }],
    "space-in-parens": "error",
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "spaced-comment": "error",
    "strict": ["error", "never"],
    "template-curly-spacing": "error",
    "unicode-bom": "error",
    "use-isnan": "error",
    "valid-jsdoc": "error",
    "valid-typeof": "error",
    "vars-on-top": "error",
    "wrap-iife": "error",
    "wrap-regex": "error",
    "yield-star-spacing": "error",
    "yoda": "error",

    "angular/angularelement": "warn",
    "angular/controller-as": "error",
    "angular/controller-as-route": "error",
    "angular/controller-as-vm": ["error", "vm"],
    "angular/controller-name": ["error", "/[A-Z].+Controller$/"],
    "angular/deferred": "off",
    "angular/definedundefined": "error",
    "angular/di": ["off", "function"],
    "angular/di-order": ["off", true],
    "angular/directive-name": "error",
    "angular/directive-restrict": ["error", {
      "restrict": "AE",
      "explicit": "never"
    }],
    "angular/component-limit": ["off", 1],
    "angular/document-service": "error",
    "angular/empty-controller": "error",
    "angular/file-name": ["off", {
      "typeSeparator": "dash",
      "nameStyle": "dash",
      "ignoreTypeSuffix": true
    }], // TODO
    "angular/filter-name": "error",
    "angular/foreach": "off",
    "angular/function-type": ["error", "named"],
    "angular/interval-service": "error",
    "angular/json-functions": "error",
    "angular/log": "error",
    "angular/module-dependency-order": ["error", {
      "grouped": true,
      "prefix": "playlister"
    }],
    "angular/module-getter": "error",
    "angular/module-name": "error",
    "angular/module-setter": "error",
    "angular/no-angular-mock": "error",
    "angular/no-controller": "off",
    "angular/no-cookiestore": "error",
    "angular/no-http-callback": "error",
    "angular/no-inline-template": ["error", {
      "allowSimple": true
    }],
    "angular/no-jquery-angularelement": "error",
    "angular/no-private-call": "error",
    "angular/no-service-method": "error",
    "angular/no-services": ["error", ["$http"]],
    "angular/on-watch": "error",
    "angular/rest-service": ["error", "$http"],
    "angular/service-name": "error",
    "angular/timeout-service": "error",
    "angular/typecheck-array": "error",
    "angular/typecheck-date": "error",
    "angular/typecheck-function": "error",
    "angular/typecheck-number": "error",
    "angular/typecheck-object": "error",
    "angular/typecheck-string": "error",
    "angular/watchers-execution": ["error", "$digest"],
    "angular/window-service": "error"
  }
};