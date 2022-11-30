module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest',
      '^.+\\.vue$': '@vue/vue3-jest',
    },
    testMatch: ["**/?(*.)+(spec|test|unit).[jt]s?(x)"]
  }