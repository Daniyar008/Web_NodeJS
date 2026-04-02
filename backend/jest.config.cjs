const path = require("path");

module.exports = {
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/tests"],
    testMatch: ["**/*.test.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transformIgnorePatterns: [
        "node_modules/(?!(openai|formdata-node|node-fetch|fetch-blob|data-uri-to-buffer|formdata-polyfill)/)",
    ],
    setupFiles: [path.resolve(__dirname, "jest.setup.cjs")],
    transform: {
        "^.+\\.[tj]s$": [
            "@swc/jest",
            {
                jsc: {
                    target: "es2022",
                    parser: {
                        syntax: "typescript",
                    },
                },
                module: {
                    type: "commonjs",
                },
            },
        ],
    },
};
