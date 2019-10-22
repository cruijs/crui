module.exports = {
    "roots": [
        "<rootDir>/src",
        "<rootDir>/v2"
    ],
    "transform": {
        "\\.ts$": "ts-jest"
    },
    "transformIgnorePatterns": [
        "node_modules/(?!@crui/)"
    ]
}