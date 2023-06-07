module.exports = {
  roots: ["<rootDir>/src"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["js", "jsx", "tsx", "ts", "json", "node"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "\\.(css)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: ["**/*.{js,jsx,ts,tsx}", "!**/node_modules/**"],
};
