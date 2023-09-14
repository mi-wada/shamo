import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  globalSetup: "<rootDir>/src/test/config/requireEnv.ts",
  setupFilesAfterEnv: ["<rootDir>/src/test/config/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
