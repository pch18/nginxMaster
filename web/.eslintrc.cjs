module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard-with-typescript", "prettier", "plugin:react/recommended"],
  parserOptions: {
    project: ["./web/tsconfig.json"],
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["prettier", "react"],
  overrides: [],
  // 0屏蔽，1警报，2错误
  rules: {
    // 开启 prettier 报错
    "prettier/prettier": 2,
    // 函数必须明确定义返回类型
    "@typescript-eslint/explicit-function-return-type": 0,
    // 在返回 void 的函数中，返回 promise，常见于 fn:()=>void = async()=>{await xxx()}
    "@typescript-eslint/no-misused-promises": 0,
    // 禁止出现 callback / cb 的字样
    "n/no-callback-literal": 0,
    // 禁止定义后未使用的变量
    "@typescript-eslint/no-unused-vars": 1,
    // 强制将 !!x 转换成 Boolean(xx)
    "no-implicit-coercion": 2,
    // 不可以在条件判断中使用any类型
    "@typescript-eslint/strict-boolean-expressions": 0,
    // 不可以在代码里使用console
    "no-console": [2, { allow: ["info", "warn", "error"] }],
    // 使用 ?? 代替 ||
    "@typescript-eslint/prefer-nullish-coalescing": 0,
    // 自动合并相同import路径的不同值
    "@typescript-eslint/no-duplicate-imports": 2,
    // 允许使用 /// 引用符号
    "@typescript-eslint/triple-slash-reference": 0,
    // 将字符串相加替换成模板字符串
    "prefer-template": 2,
    "no-useless-concat": 2,
    // 使用jsx时必须import React
    "react/react-in-jsx-scope": 0,
    // 组件比如有display名
    "react/display-name": 0,
    // 必须校验组件prop类型
    "react/prop-types": 0,
    // 禁止使用空children <Xxx></Xxx>，使用 <Xxx /> 代替
    "react/self-closing-comp": 2,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/restrict-template-expressions": 0,
  },
  root: true,
};
