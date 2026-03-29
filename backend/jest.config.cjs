module.exports = {
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/tests"],
    testMatch: ["**/*.test.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transform: {
        "^.+\\.ts$": [
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
