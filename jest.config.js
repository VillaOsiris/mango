module.exports = {
  roots: ["<rootDir>/src"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  testRunner: "jest-circus/runner",
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: ["**/*.{js,jsx}", "!**/node_modules/**"],
};
