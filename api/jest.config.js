module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    "coveragePathIgnorePatterns": [
        "/node_modules/"
    ],
    moduleNameMapper: {
        "@exmpl/(.*)": "<rootDir>/src/$1"
    },
}