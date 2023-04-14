// jest.config.js
module.exports = {
    testMatch: ['**/__tests__/**/*.js'],
    moduleDirectories: ["node_modules", "src", '../react-components'],
    moduleNameMapper: {
        '^components/(.*)$': '<rootDir>/__mocks__/components/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    // Add more setup options before each test is run

    testEnvironment: 'jest-environment-jsdom',
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    globals: {
        'babel-jest': {
            isolatedModules: true
        }
    }

}
