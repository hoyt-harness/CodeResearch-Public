const { expect } = require("chai");
const { main } = require("../index.js");

describe("Pyodide Matrix Inversion", () => {
  it("should correctly invert a 3x3 matrix", async () => {
    // Increase the timeout to allow for Pyodide initialization and NumPy loading
    // The default of 2000ms is often too short
    const testTimeout = 60000; // 60 seconds

    // It's a good practice to set the timeout for the test case explicitly
    // This can be done by using `this.timeout(milliseconds)`
    // Arrow functions (`() => {}`) don't have their own `this` context,
    // so we need to use a regular `function()` here

    // Instead of setting the timeout inside the test case, which is not recommended,
    // we'll pass it as an option to the `it` function or configure it in the test runner

    const { invertedMatrix } = await main();

    const expectedInverse = [
      [-24, 18, 5],
      [20, -15, -4],
      [-5, 4, 1]
    ];

    // Since floating point calculations can have small precision errors,
    // we should compare the values with a tolerance
    invertedMatrix.forEach((row, i) => {
      row.forEach((val, j) => {
        expect(val).to.be.closeTo(expectedInverse[i][j], 1e-9);
      });
    });
  }).timeout(60000); // Set timeout for this specific test
});
