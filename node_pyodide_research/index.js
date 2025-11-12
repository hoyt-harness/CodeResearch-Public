const { loadPyodide } = require("pyodide");

async function main() {
  console.log("Initializing Pyodide...");
  const pyodide = await loadPyodide();
  console.log("Pyodide initialized.");

  console.log("Loading NumPy...");
  await pyodide.loadPackage("numpy");
  console.log("NumPy loaded.");

  const pythonCode = `
import numpy as np

# Create a 3x3 matrix
matrix = np.array([[1, 2, 3], [0, 1, 4], [5, 6, 0]])

# Invert the matrix
inverse_matrix = np.linalg.inv(matrix)

inverse_matrix.tolist()
  `;

  console.log("Running Python code to invert matrix...");
  const startTime = performance.now();
  const result = await pyodide.runPythonAsync(pythonCode);
  const endTime = performance.now();
  console.log("Python code executed.");

  const invertedMatrix = result.toJs();

  console.log("Original Matrix:");
  console.log("[[1, 2, 3], [0, 1, 4], [5, 6, 0]]");
  console.log("Inverted Matrix:");
  console.log(invertedMatrix);
  console.log(`Execution time: ${endTime - startTime} ms`);

  return {
    invertedMatrix: invertedMatrix,
    executionTime: endTime - startTime,
  };
}

// If the script is run directly, execute the main function
if (require.main === module) {
  main().catch(err => console.error(err));
}

module.exports = { main };
