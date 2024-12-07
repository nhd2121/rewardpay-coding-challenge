import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",

  // Root directory for tests
  roots: ["<rootDir>/tests"],

  // File patterns to find test files
  testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],

  // File extensions Jest should process
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

export default config;
