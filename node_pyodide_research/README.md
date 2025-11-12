# Pyodide in Node.js Performance Report

This report details the setup, dependencies, and performance of running Pyodide with NumPy in a Node.js environment to perform a matrix inversion.

## Setup Steps

1.  **Create a new directory for the project:**
    ```bash
    mkdir node_pyodide_research
    cd node_pyodide_research
    ```

2.  **Initialize a Node.js project:**
    ```bash
    npm init -y
    ```

3.  **Install the required dependencies:**
    ```bash
    npm install pyodide mocha chai
    ```

4.  **Create the core script (`index.js`) and the test suite (`test/test.js`).**

5.  **Run the tests:**
    ```bash
    npx mocha
    ```

## Dependencies

The following Node.js dependencies are required:

*   `pyodide`: The WebAssembly-based Python distribution.
*   `mocha`: The testing framework.
*   `chai`: The assertion library for testing.

## Performance

The execution time for the Pyodide initialization, NumPy loading, and matrix inversion was measured.

*   **Execution Time:** Approximately **700 ms** on the test environment.

This time includes:
- Initializing the Pyodide runtime.
- Loading the NumPy package.
- Executing the Python code to invert a 3x3 matrix.
